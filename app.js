const express = require("express");
const routes = require("./src/routes/routes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("./src/middleware/cors");
const auth = require("./src/middleware/auth");

//
// make connection to MongoDB database
require("./src/db/db");

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};

const app = express();

app.use(helmet());

global.rootPath = __dirname + "/";
global.assetsPath = __dirname + "/assets/";
global.imagePath = __dirname + "/public/images/";
global.rootURL = "http://5.152.223.102:3738/";
global.imageURL = rootURL + "images/";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/uploads", auth, express.static("uploads"));
app.use(cors);
app.use(routes);

// serving static files
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "html");

// Trust reverse proxy (allow X-Forwarded-For headers from Apache to work, for ex.)
app.set("trust proxy", "loopback");

app.get("/", (req, res) => res.send(`Nothing to show`));

module.exports = app;
