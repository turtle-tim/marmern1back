const { resourceModel } = require("../models/resourceModel");
const { logger } = require("../utils/logger/loggerUtils");

/*
=============================================================================
Create New resources
=============================================================================
*/

exports.createResource = async (req, res) => {
  try {
    let resource = new resourceModel(req.body);
    // resource.createdAt = Date.now();

    let createdResource = await resource.save();
    res.json({ data: createdResource });
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
Save resource
=============================================================================
*/
exports.saveResource = async (req, res) => {
  try {
    const updatedResource = await resourceModel.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true }
    );
    logger.info(updatedResource);
    res.json({ data: updatedResource });
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
Get all resources
=============================================================================
*/
exports.getResource = async (req, res) => {
  try {
    let resources = await resourceModel.find({});
    res.json({ data: resources });
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
Get a specific resource by referenceId
=============================================================================
*/
exports.getResourceByReferenceId = async (req, res) => {
  try {
    let resource = await resourceModel.findOne({
      referenceId: req.params.referenceId,
    });
    logger.info(resource);
    res.json({ data: resource });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 500;
    }

    res.status(error.status).json({ message: error.message });
  }
};
