const mongoose = require("mongoose");

const EventLogSchema = mongoose.Schema(
  {
    title: { type: String },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "newIntake" },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

const EventLogModel = mongoose.model("EventLog", EventLogSchema);

module.exports.eventLogModel = EventLogModel;
module.exports.eventLogSchema = EventLogSchema;
