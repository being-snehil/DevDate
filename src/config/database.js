const mongoose = require("mongoose");

const connectDB = async () =>{
await mongoose.connect("YOUR MONGO URL");
};
module.exports = connectDB;
 
 
