import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 4 },
  roles: [{ type: String, ref: "Role" }],
  // avatarImage: { type: String, required: true },
  // posts, ref Post
  // comments
  // mb likes
});

export default mongoose.model("User", userSchema);
