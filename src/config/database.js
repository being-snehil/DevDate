const mongoose = require("mongoose");

const connectDB = async () =>{
await mongoose.connect("mongodb+srv://snehilv44:NamasteMongo@namastemongo.ej6kie0.mongodb.net/");
};
module.exports = connectDB;
 
 