const jwt = require("jsonwebtoken");
const User = require("../model/user");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, 'satya');
    req.user = decoded;
    console.log(decoded.exp)
    // if (decoded.exp < Date.now().valueOf() / 1000) { 
    //   return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    //  } 
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  
  return next();
};


const enhance = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, 'satya');
    
    const user = await User.findOne({
      email: decoded.email,
    });
    console.log(user)
    if (!user || user.role !== 'admin') throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = {verifyToken, enhance};