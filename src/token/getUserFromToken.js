import jwt from "jsonwebtoken";
const SECRET_KEY = "##!@$%^qazwsxedcrfv##!@$%^";
const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
export default getUserFromToken;
