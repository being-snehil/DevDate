const express = require("express");
const userRouter = express.Router();
const {userAuth }= require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const UserModel = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


userRouter.get("/user/requests/recevied", userAuth, async (req,res)=>{
       try {
              const loggedInUser = req.user;
          
              const connectionRequests = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested",
              }).populate("fromUserId", USER_SAFE_DATA);
              // }).populate("fromUserId", ["firstName", "lastName"]);
          
              res.json({
                message: "Data fetched successfully",
                data: connectionRequests,
              });
            } catch (err) {
              req.statusCode(400).send("ERROR: " + err.message);
            }
})

userRouter.get("/user/connection", userAuth , async(req,res)=>{
          try{
                    const loggedInUser = req.user;
                    const connnectionRequests = await ConnectionRequest.find({
                              $or : [
                                        {toUserId : loggedInUser._id , status : "accepted" },
                                        { fromUserId : loggedInUser._id , status : "accepted" }
                                 ]
                    }).populate("fromUserId", USER_SAFE_DATA )
                    .populate("toUserId", USER_SAFE_DATA);

                   const data = connnectionRequests.map(request => {
                              return request.fromUserId._id.toString() === loggedInUser._id.toString() 
                              ? request.toUserId 
                              : request.fromUserId;
                    });

                    res.json({data : data});

          }
          catch(err){
                    res.status(400).send("ERROR : " + err.message)
          }
})


userRouter.get("/user/feed", userAuth, async(req,res) =>{
       try{
              const page = parseInt(req.query.page) || 1;
              let limit = parseInt(req.query.limit) || 10;
              limit = limit > 50 ? 100 : limit; // Limit to a maximum of 100 results
              if (limit < 1) limit = 10; // Ensure limit is at least 1
              const skip = (page - 1) * limit;
              const loggedInUser = req.user;

              const connectionRequests = await ConnectionRequest.find({
                     $or : [
                            {fromUserId : loggedInUser._id },
                            {toUserId : loggedInUser._id }
                     ]
              }).select("fromUserId toUserId")

              const hideUserFromFeed = new Set();
               connectionRequests.forEach(request => {
                     hideUserFromFeed.add(request.fromUserId.toString());
                     hideUserFromFeed.add(request.toUserId.toString());
               }) 
               console.log("Hide User From Feed:", hideUserFromFeed);
               
               const user = await UserModel.find({
                   $and :  [
                   {  _id : { $nin : Array.from(hideUserFromFeed) }},
                   { _id : { $ne : loggedInUser._id } }
              ]
               }).select(USER_SAFE_DATA)
               .skip(skip)
               .limit(limit);
               console.log("User Feed Data:", user);
              res.send({ data: user });
       }
       catch(error){
              res.status(400).send("ERROR : " + error.message);
       }
} )



module.exports = userRouter;