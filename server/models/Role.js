import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  value: { type: String, unique: true, default: "USER" },
});

export default mongoose.model("Role", roleSchema);
