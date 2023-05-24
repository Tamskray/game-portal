import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creatorId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  postId: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
  date: { type: Date, default: Date.now() },
});

export default mongoose.model("Comment", commentSchema);
