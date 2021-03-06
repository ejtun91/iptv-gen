import Channel from "../../../models/Channel";
import dbConnect from "../../../util/mongo";

const handler = async (req, res) => {
  const {
    method,
    cookies,
    query: { id },
  } = req;

  const fs = require("fs");
  const token = cookies.token;
  const regexPattern = /(http(.*))/;

  dbConnect();

  console.log(req.body);

  // UPDATE FILE
  const data = fs.readFileSync(
    `../../../../var/www/iptvgenerator/lists/${req.body.title.replace(
      / /gi,
      "_"
    )}.m3u`,
    "utf8",
    function (err, data) {
      // Display the file content
      console.log(data);
    }
  );

  let result = data.replace(regexPattern, req.body.url);

  fs.writeFileSync(
    `../../../../var/www/iptvgenerator/lists/${req.body.title.replace(
      / /gi,
      "_"
    )}.m3u`,
    result,
    function (err) {
      if (err) return console.log(err);
    }
  );

  if (method === "PUT") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }

    try {
      const channel = await Channel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
