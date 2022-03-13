import Channel from "../../models/Channel";
import dbConnect from "../../util/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { search },
  } = req;

  dbConnect();
  const fs = require("fs");

  if (method === "GET") {
    try {
      let channels = await Channel.find({
        title: { $regex: search, $options: "i" },
      });
      res.status(200).json(channels);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
