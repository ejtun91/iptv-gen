import Channel from "../../models/Channel";
import dbConnect from "../../util/mongo";
import stream from "stream";
import { promisify } from "util";
import fetch from "node-fetch";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  res.setHeader("Access-Control-Allow-Origin", "*");

  const { PassThrough } = require("stream");
  let Client = require("ssh2-sftp-client");
  ///var/www/iptvgenerator/lists/lists/mylist/mylist.m3u
  let sftp = new Client();
  const remoteDir = "/var/www/iptvgenerator/lists/lists/mylist/mylist.m3u";
  const sshOpt = {
    host: process.env.CONFIG_HOST,
    port: process.env.CONFIG_PORT,
    username: process.env.CONFIG_USERNAME,
    password: process.env.CONFIG_PASSWORD,
  };
  dbConnect();
  const pipeline = promisify(stream.pipeline);

  //   if (method === "GET") {
  //     try {
  //       const channel = await Channel.find();
  //       res.status(200).json(channel);
  //     } catch (error) {
  //       res.status(500).json(error);
  //     }
  //   }

  if (method === "POST") {
    const id = req.body.uid;
    const url = `/root/iptvgenerator/public/lists/mylist/${id}.m3u`;
    const urlPath =
      "https://iptvgenerate.com/lists/mylist/9a4eb852-f24c-4853-8d4d-c453d8d1abf6.m3u";
    try {
      // const response = await fetch(urlPath); // replace this with your API call & options
      // if (!response.ok)
      //   throw new Error(`unexpected response ${response.statusText}`);

      // if (req.method === "OPTIONS") {
      //   res.status(200).end();
      // }
      // res.setHeader("Content-Type", "text/plain");
      // res.setHeader("Content-Disposition", "attachment; filename= mylist.m3u");
      // await pipeline(response.body, res);
      // res.status(200).send(response);
      sftp
        .connect(sshOpt)
        .then(() => {
          return sftp.get(url);
        })
        .then((data) => {
          if (req.method === "OPTIONS") {
            res.status(200).end();
          }
          res.setHeader("Content-Type", "application/text");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename= mylist.m3u"
          );
          res.status(200).send(Buffer.from(data));
        })
        .catch((err) => {
          console.error(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  }
}
