const express = require("express");
const app = express();
const UserModel = require("../models/user");

const isExist = async (req) => {
    const emailId = req.body.emailId;
    const checkingUser = await UserModel.findOne({ emailId: emailId }); 
    
    // findOne returns null if no user is found, not an empty array
    if (!checkingUser) {
        return null; // User does not exist
    }
    
    return checkingUser; // Return the user object if found
}

module.exports = isExist;