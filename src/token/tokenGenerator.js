import jwt from "jsonwebtoken";

const SECRET_KEY = "##!@$%^qazwsxedcrfv##!@$%^";
const user = {
  id: 1,
  username: "theredit",
  role: "admin",
};

// Generate JWT Token
const token = jwt.sign(
  {
    userId: user.id,
    username: user.username,
    role: user.role,
  },
  SECRET_KEY
  // { expiresIn: '15m' }  //For now there is no expire time.
);

console.log("Generated JWT Token:", token);
