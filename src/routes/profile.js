const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");


profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
try {
  
    if(!validateEditProfileData(req)) {
      return res.status(400).send("Invalid fields in request");
    }
    const loggedInUser = req.user;
    const updateduser = await UserModel.findByIdAndUpdate(loggedInUser._id, req.body, { new: true, runValidators: true });
    res.send(updateduser)

    
} catch (error) {
    res.status(500).send("Internal server error: " + error.message);
}
  
})


profileRouter.get("/profile", userAuth, async(req, res) => {
try {
  const user = req.user;
   // The user is attached to the request object by the middleware
      if (!user) {
          return res.status(404).send("User not found");
      }
      res.send(user);
} catch (error) {
      res.status(500).send("Internal server error: " + error.message);
  
}
});



profileRouter.patch("/profile/password", userAuth, async(req, res) => {
try { 
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).send("Old password and new password are required");
    }

    const user = await UserModel.findById(loggedInUser._id);
    
    if (!user) {
        return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    
    if (!isMatch) {
        return res.status(400).send("Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send("Password updated successfully");
}
catch (error) {
    res.status(500).send("Internal server error: " + error.message);
}
});


module.exports = profileRouter;