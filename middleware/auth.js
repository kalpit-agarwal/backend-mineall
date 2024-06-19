import jwt from "jsonwebtoken";

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
  next();
};

export default fetchUser;
