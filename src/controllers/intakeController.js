const NewIntakeModel = require("../models/newIntakeModel");
const ProgramModel = require("../models/programModel");
const generator = require("generate-password");
const { logger } = require("../utils/logger/loggerUtils");

/* CREATE ACCOUNT NUMBER --------------------------------------------------*/
/*-------------------------------------------------------------------------*/
const generateAccountId = () => {
  let accountId = generator.generate({
    length: 10,
    exclude: "O0abcdefghijklmnopqrstuvwxyz",
    uppercase: false,
    numbers: true,
  });
  return (
    accountId.substr(0, 4).toString() +
    "-" +
    accountId.substr(4, 3).toString() +
    "-" +
    accountId.substr(7, 3).toString()
  );
};

/*
=============================================================================
Add New Client
=============================================================================
*/

exports.addNewIntake = async (req, res) => {
  try {
    let client = new NewIntakeModel(req.body);
    client.accountId = generateAccountId();

    await client.save();

    res.json({
      data: client,
      message: "Saved Successfully",
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

/*
=============================================================================
Update Client
=============================================================================
*/
exports.updateNewIntake = async (req, res) => {
  try {
    const requestedClientUpdate = Object.keys(req.body);
    const allowedClientUpdates = Object.keys(NewIntakeModel.schema.paths);

    const isAValidUpdateOperation = requestedClientUpdate.every((update) => {
      logger.info(update, allowedClientUpdates.includes(update));
      return allowedClientUpdates.includes(update);
    });

    if (!isAValidUpdateOperation) {
      throw { message: "Invalid Updates!", status: 401 };
    }

    let client = await NewIntakeModel.findOne({ _id: req.params.client_id });
    if (!client) {
      throw { message: "Invalid User" };
    }

    requestedClientUpdate.forEach(
      (update) => (client[update] = req.body[update])
    );

    await client.save();

    res.json({
      data: client,
      message: "Saved Successfully",
    });
  } catch (error) {
    logger.error(error);

    if (error.status) {
      error.status = 400;
    }

    res.status(400).json({ message: error.message });
  }
};

/*
=============================================================================
Assign Program to a Client
=============================================================================
*/

exports.assignProgram = async (req, res) => {
  try {
    const program = await ProgramModel.findOne({ _id: req.body.program_id });
    if (!program) {
      throw { message: "Invalid Program!", status: 401 };
    }

    const client = await NewIntakeModel.findOne({ _id: req.body.client_id });
    if (!client) {
      throw { message: "Invalid User", status: 401 };
    }

    const wasAssignedBefore = client.programs.forEach((data) => {
      if (data.program.toString() === req.body.program_id) {
        throw {
          message: "The program was assigned before to this customer.",
          status: 401,
        };
      }
    });

    client.programs = client.programs.concat({
      program: req.body.program_id,
      attendance: true,
    });
    await client.save();

    program.attendeesCount += 1;
    await program.save();

    res.json({
      data: {
        client,
        numberOfAttendees: program.attendeesCount,
      },
      message: "Program assigned to the client successfully.",
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
Assign Program to a Client
=============================================================================
*/
exports.updateAssignedProgram = async (req, res) => {
  try {
    const client = await NewIntakeModel.findOne({ _id: req.body.client_id });
    if (!client) {
      throw { message: "Invalid Client", status: 401 };
    }

    client.programs.forEach((data) => {
      if (data.program.toString() === req.body.program_id) {
        data.attendance = req.body.attendance;
      }
    });

    await client.save();

    res.json({
      data: client,
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
Get All Clients
=============================================================================
*/
exports.getAllNewIntakes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 documents per page
    const skip = (page - 1) * limit;

    // Query data with pagination
    const clientIntake = await NewIntakeModel.find().skip(skip).limit(limit);

    // Query total count
    const totalCount = await NewIntakeModel.countDocuments();

    if (!clientIntake) {
      throw { message: "Invalid Data", status: 401 };
    }

    res.json({
      data: {
        clients: clientIntake,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        currentPage: page,
      },
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
Get a Program Attendees
=============================================================================
*/
exports.getProgramAttendees = async (req, res) => {
  try {
    let attendingClients = await NewIntakeModel.find({
      "programs.program": req.body.program_id,
    });

    res.json({
      data: attendingClients,
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
Find One Client
=============================================================================
*/
exports.getOneNewIntake = async (req, res) => {
  try {
    let clientIntake = await NewIntakeModel.findOne({
      _id: req.params.client_id,
    })
      .populate("programs.program")
      .populate("notes.user");

    res.json({
      data: clientIntake,
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
Search Clients
=============================================================================
*/
exports.searchIntake = async (req, res) => {
  try {
    let query = req.body.query;

    const clients = await NewIntakeModel.find({
      $or: [
        { accountId: { $regex: query, $options: "i" } },
        { firstName: { $regex: query, $options: "i" } },
        { middleName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        // { phones: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { postalCode: { $regex: query, $options: "i" } },
        { province: { $regex: query, $options: "i" } },
        { bandOrCommunity: { $regex: query, $options: "i" } },
      ],
    });

    res.json({
      data: clients,
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
Filter by Advocates or status or clientType or statusCFSFile
=============================================================================
*/
exports.clientFilter = async (req, res) => {
  try {
    // Build the query object with all filters that are not undefined or "All"
    const query = ["advocate", "clientType", "clientStatus", "statusCFSFile"]
      .filter((key) => req.body[key] && req.body[key] !== "All")
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const clientIntake = await NewIntakeModel.find(query)
      .populate("programs.program")
      .populate("notes.user")
      .populate("advocate");

    res.json({
      data: clientIntake,
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 400;
    }

    res.status(error.status).json({ message: error.message });
  }
};

exports.addNewNote = async (req, res) => {
  try {
    const client = await NewIntakeModel.findOne({ _id: req.body.clientId });
    if (!client) {
      throw { message: "Invalid Client", status: 401 };
    }

    client.notes = client.notes.concat({
      user: req.body.userId,
      noteType: req.body.noteType,
      noteSubType: req.body.noteSubType,
      description: req.body.description,
      attachment: req.body.attachment,
      attachmentUrl: req.body.attachmentUrl,
      createdAt: new Date(),
    });

    await client.save();

    res.json({
      data: client.notes[client.notes.length - 1],
      message: "Note add to the client successfully.",
    });
  } catch (error) {
    logger.error(error);

    if (!error.status) {
      error.status = 400;
    }

    res.json({ message: error.message });
  }
};
