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


const app=express();

const users=[];

//using middleware
app.use(express.static(path.join(path.resolve(),"public")));
//middleware for post 
app.use(express.urlencoded({extended:true}));

//setting up view engine
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index",{name:"Risha Bhowmick"});
    // res.sendFile("index.html");
})
app.get("/add",(req,res)=>{
    res.send("nice");
    // res.sendFile("index.html");
})
app.post("/",(req,res)=>{
    users.push({userName:req.body.name, email: req.body.email});
    res.render("success");
})
app.get("/users",(req,res)=>{
    res.json({
        users,
    })
})
app.listen(5000,()=>{
    console.log("Server is working");
});
















