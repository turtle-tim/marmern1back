const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Program names are unique."],
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
      trim: true,
    },
    endTime: {
      type: Date,
      required: true,
      trim: true,
    },
    attendeesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/*
=============================================================================
Duplicate Key error handling
=============================================================================
*/

const duplicateKeyErrorHandler = function (error, res, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Duplication error happened"));
  } else {
    next();
  }
};

programSchema.post("save", duplicateKeyErrorHandler);
programSchema.post("update", duplicateKeyErrorHandler);
programSchema.post("findOneAndUpdate", duplicateKeyErrorHandler);
programSchema.post("insertMany", duplicateKeyErrorHandler);

programSchema.index({ "$**": "text" });

const ProgramsModel = mongoose.model("program", programSchema);

module.exports = ProgramsModel;
