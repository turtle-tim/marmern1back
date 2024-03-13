const { notificationModel } = require("../models/notificationModel");
const { logger } = require("../utils/logger/loggerUtils");

/*
=============================================================================
Create New Notifications
=============================================================================
*/

exports.createNotification = async (req, res) => {
  try {
    let notification = new notificationModel(req.body);
    notification.createdAt = Date.now();

    let u = await notification.save();

    res.json({
      data: u,
      message: "A Notification has been sent to the user",
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
Save Notification
=============================================================================
*/
exports.saveNotification = async (req, res) => {
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      req.body._id,
      req.body
    );

    res.json({
      data: updatedNotification,
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
Get Notification
=============================================================================
*/
exports.getNotifications = async (req, res) => {
  try {
    let notifications = await notificationModel
      .find({})
      .sort({ createdAt: -1 });

    res.json({
      data: notifications,
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
Get a specific user Notifications
=============================================================================
*/
exports.getNotificationsByUser = async (req, res) => {
  try {
    let notifications = await notificationModel
      .find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({
      data: notifications,
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};
