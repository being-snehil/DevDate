const validator = require("validator");
const validateSignupData = (req) =>{
          const { firstName, lastName, emailId, password } = req?.body;
          if(!firstName || !emailId || !password) {
                    throw new Error("First name, emailId and password are required");
                    
          }
          else if(firstName.length < 3 || firstName.length > 20) {
                    throw new Error("First name must be between 3 and 20 characters");
          }
          else if(!validator.isEmail(emailId)) {
                    throw new Error("Invalid email format");
          }
          else if(!validator.isStrongPassword(password)) {
                    throw new Error("Weak password. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol.");
                    
          }
}
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {validateSignupData, validateEditProfileData}; ;