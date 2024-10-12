import getUserFromToken from "../token/getUserFromToken.js";

const authContext = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const user = getUserFromToken(token);
    return { user };
  }
  return { user: null };
};

export default authContext;
