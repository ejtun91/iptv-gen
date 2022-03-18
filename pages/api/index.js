import Channel from "../../models/Channel";
import dbConnect from "../../util/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  // This will allow OPTIONS request
  if (method === "OPTIONS") {
    return res.status(200).send("ok");
  }

  dbConnect();

  if (method === "GET") {
    try {
      const channel = await Channel.find();
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
