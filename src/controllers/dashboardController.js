const newIntakeModel = require("../models/newIntakeModel");
const userModel = require("../models/userModel");
const { eventLogModel } = require("../models/eventLogModel");
const { logger } = require("../utils/logger/loggerUtils");

exports.caseCountByAdvocates = async (req, res) => {
  try {
    const userColumn = ["unit", "caseWorkerType", "firstName", "lastName"];
    let users = await userModel
      .find({ caseWorkerType: "Advocates" })
      .select(userColumn);
    for (let user of users) {
      user._doc.intakeCount = await newIntakeModel
        .find({ advocate: user._id })
        .count();
    }

    res.json({
      data: users,
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

exports.clientsCountPerBand = async (req, res) => {
  try {
    let result = await newIntakeModel.aggregate([
      { $group: { _id: "$bandOrCommunity", count: { $sum: 1 } } },
    ]);

    res.json({
      data: result,
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

exports.clientsCountPerAgency = async (req, res) => {
  try {
    let result = await newIntakeModel.aggregate([
      { $unwind: "$bandOrCommunityState" },
      { $group: { _id: "$bandOrCommunityState", count: { $sum: 1 } } },
    ]);

    res.json({
      data: result,
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

exports.clientsCountPerStatus = async (req, res) => {
  try {
    let result = await newIntakeModel.aggregate([
      { $group: { _id: "$clientStatus", count: { $sum: 1 } } },
    ]);

    res.json({
      data: result,
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

exports.inactiveClients = async (req, res) => {
  try {
    const targetDate = req.params.targetDate;
    let clientHavingLogs = await eventLogModel
      .find({ createdAt: { $gte: new Date(targetDate) } })
      .distinct("clientId");
    let inactiveClients = await newIntakeModel.find(
      { _id: { $nin: clientHavingLogs } },
      {
        _id: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        clientStatus: true,
      }
    );
    res.json({
      data: inactiveClients,
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};
