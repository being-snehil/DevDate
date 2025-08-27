const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : "User" ,
        required: true
    },
    toUserId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "Invalid status"
        },
        required: true
    }
}, { timestamps: true });

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Use PascalCase for model name
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;