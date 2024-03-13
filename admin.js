require("./src/db/db");
const { logger } = require("./src/utils/logger/loggerUtils");
const UserModel = require("./src/models/userModel");
const Crypto = require("crypto");

let admin_password = Crypto.randomBytes(10).toString("hex");

user = new UserModel({
  firstName: "FNFAO",
  lastName: "Admin",
  email: "admin@fnfao.com",
  password: admin_password,
  access: "admin",
  active: true,
});

user.save();
logger.info(
  "Initial user created. Email is admin@fnfao.com, password is " +
    admin_password
);
