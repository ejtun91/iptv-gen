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

  dbConnect();
  const https = require("https");
  const fs = require("fs");
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
    let id = req.body.uid;
    const url = `https://iptvgenerate.com/lists/mylist/${id}.m3u`;
    console.log(req);
    try {
      const response = await fetch(url); // replace this with your API call & options
      if (!response.ok)
        throw new Error(`unexpected response ${response.statusText}`);

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", "attachment; filename= mylist.m3u");
      await pipeline(response.body, res);
      res.send("ok");
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
