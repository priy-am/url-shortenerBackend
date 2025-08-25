import { model, Schema } from "mongoose";

const urlSchema = new Schema({
  code: { type: String, unique: true, index: true },
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

export default model("Url", urlSchema);