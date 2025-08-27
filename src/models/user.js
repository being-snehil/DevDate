const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
          firstName: {type: String , required: true},
          lastName: {type : String, },
          emailId : { type : String , required: true, unique: true , lowercase: true , trim: true ,
                    validate(value){
                    if(!validator.isEmail(value)) {
                              throw new Error("Invalid email format: " + value);
                    }
          }
          },
          password : { type : String , required: true, validate(value){
                    if(!validator.isStrongPassword(value)) {
                              throw new Error("Weak password");
                    }
          }},
          age : {type : Number , required: true, min: 18, max: 100},
          gender : {type : String ,  
            enum : {
                values : ["male", "female" , "others"],
                message: "Invalid gender"
            },
            required : true
          },
          photoUrl : {type : String},
          about : {type : String , default: "Hey there! I am using DevDate"},
          skills : {type : [String], validate(value){
                    if(value.length < 1) {
                              throw new Error("Skills cannot be empty");
                    }
                    else if(value.length > 10) {
                              throw new Error("Skills cannot be more than 10");
                    }
          }},

}, {timestamps: true});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    // Remove sensitive information
    delete userObject.password;

    return userObject;
};
userSchema.methods.getJWT = async function(){
const user = this;
const token  = await jwt.sign({_id : user._id}, "Snehilji456", {expiresIn: "7d"});
return token;
}

const UserModel = mongoose.model("User" , userSchema);

module.exports = UserModel;

