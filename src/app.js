const express = require("express");

const app = express();

app.use("/test",(req,res)=>{
          res.send("Namaste bhai");
})


app.listen(3000, ()=>{
          console.log("server is listening in port 3000")
})