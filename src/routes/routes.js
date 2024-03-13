const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const cors = require("../middleware/cors");

const common_controller = require("../controllers/commonController");

const user_controller = require("../controllers/userControllers");
const content_controller = require("../controllers/contentController");
const notification_controller = require("../controllers/notificationController");
const resource_controller = require("../controllers/resourceController");
const event_log_controller = require("../controllers/eventLogController");
const intake_controller = require("../controllers/intakeController");
const program_controller = require("../controllers/programController");
const dashboard_controller = require("../controllers/dashboardController");

/*
=============================================================================
common routes
=============================================================================
*/

router.get("/version", common_controller.getVersionNumber);

/*
=============================================================================
User routes
=============================================================================
*/
router.post("/login", user_controller.login);
router.post("/users", auth, user_controller.createUser);
router.put("/users", auth, user_controller.updateUser);
router.post("/getInfo", auth, user_controller.getInfo);
router.get("/users", auth, user_controller.getAllUsers);
router.post("/logout", auth, user_controller.logout);
router.post("/getAdvocates", auth, user_controller.getAdvocates);

/*
=============================================================================
Program routes
=============================================================================
*/
router.post("/getOneProgram", auth, program_controller.getOneProgram);
router.post("/addProgram", auth, program_controller.addProgram);
router.get("/getAllPrograms", auth, program_controller.getAllPrograms);

/*
=============================================================================
new client intake routes
=============================================================================
*/
router.post("/addNewIntake", auth, intake_controller.addNewIntake);
router.post(
  "/updateNewIntake/:client_id",
  auth,
  intake_controller.updateNewIntake
);
router.get("/getAllNewIntakes", auth, intake_controller.getAllNewIntakes);
router.post("/assignProgram", auth, intake_controller.assignProgram);
router.post("/addNewNote", auth, intake_controller.addNewNote);
router.post(
  "/getOneNewIntake/:client_id",
  auth,
  intake_controller.getOneNewIntake
);

router.post(
  "/updateAssignedProgram",
  auth,
  intake_controller.updateAssignedProgram
);

router.post(
  "/getProgramAttendees",
  auth,
  intake_controller.getProgramAttendees
);
router.post("/searchIntake", auth, intake_controller.searchIntake);
router.post("/clientFilter", auth, intake_controller.clientFilter);
/*
=============================================================================
Content routes
=============================================================================
*/

router.post("/search", auth, content_controller.search);

router.post(
  "/profileImageUpload",
  auth,
  content_controller.profileImageUpload.single("profileImage"),
  content_controller.uploadFile
);

router.post(
  "/fileUpload",
  auth,
  content_controller.fileUpload.single("file"),
  content_controller.uploadFile
);

router.post(
  "/notesAttachmentUpload",
  auth,
  content_controller.notesAttachmentUpload.single("notesAttachment"),
  content_controller.uploadFile
);

/*
=============================================================================
Notification routes
=============================================================================
*/
router.get("/notifications", auth, notification_controller.getNotifications);
router.post("/notifications", auth, notification_controller.createNotification);
router.put("/notifications", auth, notification_controller.saveNotification);
router.get(
  "/user/:userId/notifications",
  auth,
  notification_controller.getNotificationsByUser
);

/*
=============================================================================
Resource routes
=============================================================================
*/
// router.get("/resource", auth, resource_controller.getResource);
// router.get( "/resource/:referenceId", auth, resource_controller.getResourceByReferenceId);
// router.post("/resource", auth, resource_controller.createResource);
// router.put("/resource", auth, resource_controller.saveResource);

router.get("/resource", resource_controller.getResource);
router.get(
  "/resource/:referenceId",
  resource_controller.getResourceByReferenceId
);
router.post("/resource", resource_controller.createResource);
router.put("/resource", resource_controller.saveResource);

/*
=============================================================================
EventLog routes
=============================================================================
*/
router.get(
  "/client/:clientId/eventLog",
  auth,
  event_log_controller.getEventLogByClient
);
router.post("/eventLog", auth, event_log_controller.createEventLog);

/*
=============================================================================
Dashboard routes
=============================================================================
*/

router.get(
  "/caseCountByUsers",
  auth,
  dashboard_controller.caseCountByAdvocates
);
router.get(
  "/clientsCountPerBand",
  auth,
  dashboard_controller.clientsCountPerBand
);
router.get(
  "/clientsCountPerAgency",
  auth,
  dashboard_controller.clientsCountPerAgency
);
router.get(
  "/clientsCountPerStatus",
  auth,
  dashboard_controller.clientsCountPerStatus
);

router.get(
  "/inactiveClients/:targetDate",
  auth,
  dashboard_controller.inactiveClients
);

module.exports = router;
