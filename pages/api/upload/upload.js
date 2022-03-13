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
  const regexPattern = /(http(.*)\d{3,})/gm;

  dbConnect();

  // console.log(req.body);

  if (method === "PUT") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }

    try {
      fs.writeFile(
        `https://lists.iptvgenerate.com/lists/uploaded/playlist.m3u`,
        req.body.playlist,
        (err) => {
          if (err) console.log(err);
        }
      );
      res.status(200).send("uploaded");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "POST") {
    let data = req.body.channels;
    const regexPattern = /(http(.*)\d{3,})/gm;

    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }

    try {
      // UPDATE FILE
      const dataFiles = fs.readFile(
        `https://lists.iptvgenerate.com/lists/uploaded/playlist.m3u`,
        "utf8",
        function (err, files) {
          // Display the file content
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              //do something with e.g. req.body[key]

              let pattern = `${data[key].title}`;
              let pat = new RegExp(pattern, "gi");
              //   console.log(files.match(pat));
              let matchReg = files.match(pat);
              if (pat.test(files)) {
                if (matchReg.includes(data[key].title)) {
                  let temp = data[key].title;
                  fs.readFile(
                    `https://lists.iptvgenerate.com/lists/${temp.replace(
                      / /g,
                      "_"
                    )}.m3u`,
                    "utf8",
                    async function (err, items) {
                      // Display the file content
                      let regexP = `(?<=${temp}\r|${temp}\n|${temp}\r\n)[^\r\n]+`;
                      let pat2 = new RegExp(regexP, "g");
                      let result = items.replace(pat2, files.match(pat2)[0]);
                      await Channel.updateOne(
                        { title: temp },
                        {
                          $set: { url: files.match(pat2)[0] },
                        }
                      );
                      fs.writeFile(
                        `https://lists.iptvgenerate.com/lists/${temp.replace(
                          / /g,
                          "_"
                        )}.m3u`,
                        result,
                        function (err) {
                          if (err) return console.log(err);
                        }
                      );
                    }
                  );
                }
              }
            }
          }
        }
      );
      res.status(200).send("replaced links");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
