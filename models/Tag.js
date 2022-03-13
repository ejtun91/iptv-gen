import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 60,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);
