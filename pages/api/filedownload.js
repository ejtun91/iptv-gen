import Channel from "../../models/Channel";
import dbConnect from "../../util/mongo";
import stream from "stream";
import { promisify } from "util";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

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
    const url = `https://iptvgenerate.com/lists/mylist/${req.body.uid}.m3u`;

    try {
      const response = await fetch(url); // replace this with your API call & options
      if (!response.ok)
        throw new Error(`unexpected response ${response.statusText}`);

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", "attachment; filename= mylist.m3u");
      await pipeline(response.body, res);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
