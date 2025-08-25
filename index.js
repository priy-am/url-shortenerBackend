import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/database.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL].filter(Boolean), 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
    credentials: false,
  })
);
app.use(express.json());
app.use(morgan("dev"));
connectDB();


app.get("/", (req, res)=>{
    res.send("Hello Cuties")
})

app.use("/api/url", urlRoutes );

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
