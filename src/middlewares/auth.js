const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("../models/user");
const userAuth =  async (req,res,next)=>{

       try {
       // read the token from cookies
       const {token} = req.cookies;
       if(!token){
              return res.status(401).send("Unauthorized : No token provided");
       }
       //verify the token
              const decoded = jwt.verify(token, "Snehilji456");
              const {_id} = decoded;
              const user = await UserModel.findById(_id)
              if(!user) {
                     throw new Error("User not found");
                     
              }

              req.user = user; // Attach the user to the request object
              next();
       } catch (error) {
              res.status(401).send("Unauthorized : " + error.message);
       }

};

module.exports = {
          userAuth,
}
