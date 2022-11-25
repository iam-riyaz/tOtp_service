import express from "express";
import dotenv from "dotenv";
import { otpRouter } from "./routes/otp.Route";
import { connectDB } from "./config/db";
import {createServer} from  "./utils/server"
dotenv.config();



const port = process.env.PORT || 2000;

const app= createServer()

app.use("/v1/otp", otpRouter);

app.get("/", (req, res) => {

  res.status(200).send("this is just a test")
})

export {app}

connectDB().then(() => {
  app.listen(port, () => {
    // console.log(`listioning on port ${port}`);
  });
});
