import Channel from "../../../models/Channel";
import Tag from "../../../models/Tag";
import dbConnect from "../../../util/mongo";

const handler = async (req, res) => {
  const {
    method,
    cookies,
    query: { id },
  } = req;

  const token = cookies.token;
  const fs = require("fs");

  const findRemoveSync = require("find-remove");

  dbConnect();

  if (method === "GET") {
  }

  if (method === "PUT") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }
    try {
      const channel = await Channel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      fs.renameSync(
        `../../../../var/www/iptvgenerator/lists/${req.body.oldTitle.replace(
          / /gi,
          "_"
        )}.m3u`,
        `../../../../var/www/iptvgenerator/lists/${req.body.title.replace(
          / /gi,
          "_"
        )}.m3u`
      );
      console.log(req.body);
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "DELETE") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }
    try {
      const channel = await Channel.findByIdAndDelete(id, {
        new: true,
      });

      findRemoveSync("lists", {
        limit: 1,
        files: `${req.body.title.replace(/ /gi, "_")}.m3u`,
      });
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
