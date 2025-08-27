const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status; 
        
        // Updated to match schema enum values
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const DoestoUserIdExist = await UserModel.findById(toUserId);
          if (!DoestoUserIdExist) {
                    return res.status(404).json({ error: "User to send request does not exist" });
          }
        
        const isConnectionRequestExists = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        //check users cannot send connection request to themselves
        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({ error: "You cannot send a connection request to yourself" });
        }
        
        if (isConnectionRequestExists) {
            return res.status(400).json({ error: "Connection request already exists" });
        }

        // Create new instance with different variable name
        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        
        const data = await newConnectionRequest.save();
        res.status(201).json({ message: "Connection request sent successfully", data });
    }
    catch (error) {
        res.status(500).send("Internal server error: " + error.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
          try{
                    const loggedInUser = req.user;
                    const {status, requestId} = req.params;
                    const allowedStatus = ["accepted", "rejected"];

                    if(!allowedStatus.includes(status)){
                           return   res.status(400).json({message : "Invalid Status"});
                    }
                    const connectionRequest = await ConnectionRequest.findById({
                              _id : requestId,
                              toUserId : loggedInUser._id,
                              status : "interested",
                    })
                    if(!connectionRequest){
                              return res.status(404).json({message  : "connection request not found"})
                    }
                    connectionRequest.status = status;
                    const data = await connectionRequest.save();
                    res.send(data);
          }
          catch (error) {
            res.status(500).send("Internal server error: " + error.message);
          }
}
)

module.exports = requestRouter;