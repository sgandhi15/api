const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const auth = async (req, res, next) => {
  // try {
  //   const token = req.header("Authorization").replace("Bearer ", "");
  //   const decode = jwt.verify(token, process.env.JWT_SECRET);
  //   let user;
  //   if (decode) {
  //     patient = await User.findOne({
  //       _id: decode._id,
  //       "tokens.token": token,
  //     });
  //     req.token = token;
  //     req.user = user;
  //     next();
  //   } else throw new Error("Please authenticate and login again...!");
  // } catch (error) {
  //   res.status(401).send(error.message);
  // }
};

module.exports = auth;
