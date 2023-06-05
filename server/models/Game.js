import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  developer: { type: String, required: true },
  platforms: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, required: false },
  hours: { type: Array, default: [] },
  achievements: { type: Array, default: [] },
  //   comments..
});

export default mongoose.model("Game", gameSchema);
