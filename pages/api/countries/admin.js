import Channel from "../../../models/Channel";
import Tag from "../../../models/Tag";
import dbConnect from "../../../util/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  dbConnect();
  const fs = require("fs");

  if (method === "GET") {
    try {
      const channel = await Channel.find();
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "POST") {
    let titleTrimmed = req.body.title.replace(/ /g, "_");
    console.log(req.body);
    try {
      const channel = await Channel.create(req.body);
      //UPLOAD FILE
      const htmlString = `#EXTM3U
#EXTINF:0 tvg-country=${req.body.country} tvg-logo='' group-title='Undefined',${req.body.title}
${req.body.url}`;
      fs.writeFile(
        `https://lists.iptvgenerate.com/lists/${titleTrimmed}.m3u`,
        htmlString,
        (err) => {
          if (err) console.log(err);
        }
      );
      res.status(201).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "PUT") {
  }
}
