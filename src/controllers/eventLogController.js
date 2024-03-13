const { eventLogModel } = require("../models/eventLogModel");
const { logger } = require("../utils/logger/loggerUtils");

/*
=============================================================================
Create New eventLogs
=============================================================================
*/

exports.createEventLog = async (req, res) => {
  try {
    let eventLog = new eventLogModel(req.body);

    let createdeventLog = await eventLog.save();
    res.json({ data: createdeventLog });
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
Get all eventLogs of a client
=============================================================================
*/
exports.getEventLogByClient = async (req, res) => {
  try {
    let eventLogs = await eventLogModel
      .find({ clientId: Object(req.params.clientId) })
      .sort({ createdAt: -1 });
    res.json({ data: eventLogs });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};
