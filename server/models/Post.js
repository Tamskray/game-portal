import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  rubric: { type: String, required: true },
  content: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  // creator: { type: String, required: true },
  comments: { type: Array, default: [] },
  likes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  //   imageTitle
});

export default mongoose.model("Post", postSchema);
