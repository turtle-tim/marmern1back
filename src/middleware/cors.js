const ALLOWED_ORIGINS = [
  "http://localhost:4200",
  "https://fnfaodatabase.firstnationsfamilyadvocate.com",
  "https://staging-db.firstnationsfamilyadvocate.com",
];

const cors = async (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  let origin = req.headers.origin;
  let theOrigin =
    ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];

  res.header("Access-Control-Allow-Origin", theOrigin);

  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,HEAD,DELETE,OPTIONS"
  );

  res.header("Access-Control-Allow-Credentials", "true");

  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Cache-Control,X-Auth-Token,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization"
  );

  res.header("Access-Control-Expose-Headers", "X-Auth-Token");

  next();
};

module.exports = cors;
