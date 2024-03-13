const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    if (!req.cookies.access_token) {
      throw new Error("It seems you need to log in first.");
    }

    const token = req.cookies.access_token.replace("Bearer ", "");
    const authUser = await jwt.verify(
      token,
      process.env.JWT_SECRET,
      async function (error, decoded) {
        if (error) {
          throw new Error("Not authorized user!");
        }

        const user = await UserModel.findOne({
          _id: decoded._id,
          "tokens.token": token,
        });

        if (user.active === false) {
          throw new Error("this user is not active and can't login");
        }

        req.user = user;
      }
    );
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = auth;
