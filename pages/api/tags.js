import Tag from "../../models/Tag";
import dbConnect from "../../util/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  dbConnect();
  const fs = require("fs");

  if (method === "GET") {
    try {
      const tags = await Tag.find();
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "POST") {
    try {
      const tag = await Tag.create(req.body);
      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
