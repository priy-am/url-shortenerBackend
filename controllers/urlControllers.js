import Url from "../models/urlSchema.js";
import isValidUrl from "../config/isValidUrl.js";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

export const shorten = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
    if (!longUrl || !isValidUrl(longUrl)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid URL (http/https)." });
    }
    const normalized = longUrl.trim();
    let existing = await Url.findOne({ longUrl: normalized }).lean();
    if (existing) return res.json(existing);

    const code = nanoid(7);
    const shortUrl = `${BASE_URL}/${code}`;

    const doc = await Url.create({ code, longUrl: normalized, shortUrl });
    return res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const redirect = async (req, res) => {
  try {
    const { code } = req.params;
    console.log("Code:", code);
    const found = await Url.findOne({ code }).lean();
    if (!found) return res.status(404).send("Short URL not found");

    // increment click count but don't block the redirect
    Url.updateOne({ _id: found._id }, { $inc: { clicks: 1 } }).catch(() => {});

    return res.redirect(302, found.longUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllList = async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const urls = await Url.find({}).sort({ createdAt: -1 }).lean();
    res.json(urls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
