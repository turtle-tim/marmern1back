const NewIntakeModel = require("../models/newIntakeModel");
const ProgramModel = require("../models/programModel");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { logger } = require("../utils/logger/loggerUtils");
const { s3, signedUrl } = require("../utils/aws-s3/s3FileUtils");

const AWS_BUCKET_NAME = "fnfao";
/*
=============================================================================
Search
=============================================================================
*/
exports.search = async (req, res) => {
  try {
    let query = req.body.query;
    let result = { clients: [], programs: [] };

    if (query) {
      let clients = await NewIntakeModel.find({
        $or: [
          { accountId: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
          { middleName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { "phones.phoneNumber": { $regex: query, $options: "i" } },
          { clientType: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { postalCode: { $regex: query, $options: "i" } },
          { province: { $regex: query, $options: "i" } },
          { bandOrCommunity: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      });

      let programs = await ProgramModel.find({
        $or: [{ name: { $regex: query, $options: "i" } }],
      });

      result.clients = clients;
      result.programs = programs;

      res.json({
        data: result,
      });
    }
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
Upload File
=============================================================================
*/
exports.uploadFile = async (req, res) => {
  const rootUrl = req.protocol + "://" + req.headers.host + "/";

  logger.info(JSON.stringify(req.body));

  try {
    if (!req.body._id) throw { message: "Intake id is required", status: 400 };
    if (!req.body.uploadType)
      throw { message: "Upload type is required", status: 400 };
    if (
      !req.body.uploadType === "file" &&
      !req.body.uploadType === "notesAttachment" &&
      !req.body.uploadType === "profileImage"
    ) {
      throw { message: "Invalid upload type", status: 400 };
    }
    if (!req.file) {
      throw { message: "File upload was not successful", status: 400 };
    }

    const intake = await NewIntakeModel.findOne({ _id: req.body._id });

    if (!intake) throw { message: "Intake not found", status: 404 };

    if (req.body.uploadType === "notesAttachment") {
      return res.json({
        data: {
          attachment: req.file.originalname,
          attachmentUrl: req.file.location,
        },
      });
    }

    if (req.body.uploadType === "profileImage") {
      intake.profileImage = req.file ? req.file.location : null;
    }

    if (req.body.uploadType === "file") {
      intake.files.push({
        fileName: req.file.originalname,
        filePath: req.file.location,
        uploadedAt: new Date().toDateString(),
      });
    }

    await intake.save();

    res.json({
      data: intake,
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
AWS S3 Storage
=============================================================================
*/
const s3Storage = multerS3({
  s3: s3,
  bucket: "fnfao",
  cacheControl: "max-age=31536000",
  key: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: req.body.uploadType,
      originalName: file.originalname,
      fieldName: file.fieldname,
      createdAt: new Date().toISOString(),
    });
  },
});

/*
=============================================================================
File Upload
=============================================================================
*/

exports.fileUpload = multer({
  storage: s3Storage,
});

/*
=============================================================================
Profile Image Upload
=============================================================================
*/

const filterProfileImage = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.profileImageUpload = multer({
  storage: s3Storage,
  fileFilter: filterProfileImage,
});

/*
=============================================================================
Upload Attachments for Notes
=============================================================================
*/

exports.notesAttachmentUpload = multer({
  storage: s3Storage,
});
