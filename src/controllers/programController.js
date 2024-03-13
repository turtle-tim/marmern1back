const ProgramsModel = require("../models/programModel");
const { logger } = require("../utils/logger/loggerUtils");

/*
=============================================================================
Save a New Program
=============================================================================
*/
exports.addProgram = async (req, res) => {
  try {
    if (req.user.access !== "admin" && req.user.access !== "read-and-write") {
      throw { message: "Unauthorized access!", status: 401 };
    }

    let program = new ProgramsModel(req.body);
    await program.save();

    res.json({
      data: program,
      message: "Saved Successfully",
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
Get One Program
=============================================================================
*/
exports.getOneProgram = async (req, res) => {
  try {
    let program = await ProgramsModel.findOne({ _id: req.body._id });

    if (!program) {
      throw { message: "Invalid Program.", status: 400 };
    }

    return res.json({
      data: program,
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 400;
    }

    res.json({ message: error.message });
  }
};

/*
=============================================================================
Get All Programs
=============================================================================
*/
exports.getAllPrograms = async (req, res) => {
  try {
    let programs = await ProgramsModel.find({});
    res.json({
      data: programs,
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 400;
    }

    res.json({ message: error.message });
  }
};

/*
=============================================================================

=============================================================================
*/
exports.getJustUserPrograms = async (req, res) => {
  try {
    let programs = await programsModel.find({}).populate("newIntake");
    res.json({
      data: programs,
      // message: "Saved Successfully"
    });
  } catch (err) {
    logger.error(error);

    if (!error.status) {
      error.status = 400;
    }

    res.json({ message: error.message });
  }
};
