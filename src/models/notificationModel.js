const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    message: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports.notificationModel = NotificationModel;
module.exports.notificationSchema = notificationSchema;
