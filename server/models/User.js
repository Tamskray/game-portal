import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 4 },
  image: { type: String, required: false },
  roles: [{ type: String, ref: "Role" }],
  posts: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      default: [],
      ref: "Post",
    },
  ],
  // posts, ref Post
  // comments
  // mb likes
});

export default mongoose.model("User", userSchema);
