// import http from "http";
// import gfName from "./features.js";
// import { gfName2,gfName3,generateLovePercent } from "./features.js";

// import fs from "fs";

// console.log(gfName);
// console.log(gfName2);
// console.log(gfName3);
// console.log(generateLovePercent());

// const server = http.createServer((req, res) => {
//   console.log(req.url);
//   if (req.url === "/about") {
//     res.end(`<h1>Love is ${generateLovePercent()} </h1>`);
//   } else if (req.url === "/") {
//     fs.readFile("./index.html",(err,data)=>{
//         res.end(data);
//     });
//   } else if (req.url === "/contact") {
//     res.end("<h1>Contact Page</h1>");
//   } else {
//     res.end("<h1>Page Not Found</h1>");
//   }
// });

// server.listen(5000, () => {
//   console.log("Server is working");
// });

import { name } from "ejs";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017/", { dbName: "backend" })
  .then(() => console.log("Database connected"))
  .catch((e) => console.log(e));

//structuring a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//creating a schema named Message
const User = mongoose.model("User", userSchema);

const app = express();

const users = [];

//using middleware
app.use(express.static(path.join(path.resolve(), "public")));
//middleware for post
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//setting up view engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "kdsvfkjbh");
    // console.log(decoded);
    req.risha = await User.findById(decoded._id);
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  console.log(req.risha);
  res.render("logout", { name: req.risha.name });
  //   res.render("index", { name: "Risha Bhowmick" });
  // res.sendFile("index.html");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.redirect("/register");
  }

  // const isMatch = user.password === password;
  const isMatch = await bcrypt.compare(password,user.password);

  if (!isMatch) {
    return res.render("login", { email, message: "Incorrect Password" });
  }
  const token = jwt.sign({ _id: user._id }, "kdsvfkjbh");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedPassword=await bcrypt.hash(password,10);

  user = await User.create({
    name,
    email,
    password:hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "kdsvfkjbh");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});
app.get("/logout", (req, res) => {
  res.cookie("token", "iamin", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

// app.get("/add", async (req, res) => {
//   await Message.create({ name: "Ivy", email: "gravy@gmail.com" });
//   res.send("nice");

//   // res.sendFile("index.html");
// });

app.listen(5000, () => {
  console.log("Server is working");
});
