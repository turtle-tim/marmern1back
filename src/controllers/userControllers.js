const UserModel = require("../models/userModel");
const { logger } = require("../utils/logger/loggerUtils");

/*
=============================================================================
Login
=============================================================================
*/
exports.login = async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res
      .cookie("access_token", "Bearer " + token, {
        expires: new Date(Date.now() + 13 * 3600000), // expires after 13 hours
        httpOnly: true,
      })
      .json({ data: user, message: "Successfully logged in." });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Get all Users
=============================================================================
*/
exports.getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find({});
    res.json({
      data: users,
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Add a new user
=============================================================================
*/
exports.createUser = async (req, res) => {
  try {
    let user = new UserModel(req.body);
    await user.save();

    res.status(200).send({
      data: user,
      message: "User added successfully.",
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Update an existing user
=============================================================================
*/
exports.updateUser = async (req, res) => {
  try {
    const requestedUserUpdate = Object.keys(req.body);
    const allowedUserUpdates = Object.keys(UserModel.schema.paths);

    const isAValidUpdateOperation = requestedUserUpdate.every((update) =>
      allowedUserUpdates.includes(update)
    );

    if (!isAValidUpdateOperation) {
      throw { message: "Invalid Updates!", status: 401 };
    }

    const user = await UserModel.findOne({ _id: req.body._id });
    if (!user) {
      throw { message: "Invalid User" };
    }

    requestedUserUpdate.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.json({
      data: user,
      message: "Saved Successfully",
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Get user info
=============================================================================
*/
exports.getInfo = async (req, res, next) => {
  try {
    res.json({ data: req.user });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Logout
=============================================================================
*/
exports.logout = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res
      .clearCookie("access_token")
      .clearCookie("_id")
      .json({ message: "Successfully logged out" });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Get all advocates
=============================================================================
*/
exports.getAdvocates = async (req, res) => {
  try {
    // Originally returned based on caseWorkerType, this has changed.
    // let advocates = await UserModel.find({ caseWorkerType: "Advocates" });

    // Return all users,not just advocates.
    let advocates = await UserModel.find({}).sort("lastName").exec();

    res.json({
      data: advocates,
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};
