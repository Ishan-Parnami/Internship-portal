import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.js";

const app = express();
app.use(bodyParser.json())
dotenv.config();
const URL = process.env.MONGODB_URL;
app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000"],
  credentials:true
}));
app.use(cookieParser());

app.use("/auth",UserRouter)
mongoose.connect(URL)
.then(() => {
    console.log("connected to Mongodb");
  })
  .catch((err) => {
    throw err
  });
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
});