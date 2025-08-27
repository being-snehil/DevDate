const express = require("express");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const isExist = require("../utils/userExist");
const {validateSignupData} = require("../utils/validation");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
    try {
        validateSignupData(req);

        const { firstName, lastName, emailId, password , photoUrl } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            age: req.body.age,
            skills: req.body.skills,
            gender : req.body.gender,
            photoUrl : photoUrl
        });

        await newUser.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    
    try {
        if (!validator.isEmail(emailId)) {
            return res.status(400).send("Invalid email format");
        }

        const user = await isExist(req);
        
        if (!user) {
            return res.status(404).send("User does not exist");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            const token = await user.getJWT();
            // console.log("Token generated:", token);
            res.cookie("token", token);
            res.send(user);
        } else {
            throw new Error("Invalid password");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

authRouter.post("/logout", (req,res)=>{
  try{
    res.cookie("token", null , {
      expires: new Date(Date.now())
     })
     res.send("Logout successful");
  }
  catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }

})

module.exports = authRouter;