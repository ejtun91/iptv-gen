import { Icon } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    mylist: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],
    country: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    liveliness: {
      type: Number,
      default: 100,
    },
    days: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
    checked: {
      type: String,
    },
    hd: {
      type: String,
    },
    mbps: {
      type: Number,
      default: 3800,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Channel ||
  mongoose.model("Channel", ChannelSchema);
