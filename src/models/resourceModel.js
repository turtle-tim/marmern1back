const mongoose = require("mongoose");

const ResourceSchema = mongoose.Schema(
  {
    title: { type: String },
    referenceId: { type: String },
    items: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const ResourceModel = mongoose.model("Resource", ResourceSchema);

module.exports.resourceModel = ResourceModel;
module.exports.resourceSchema = ResourceSchema;
