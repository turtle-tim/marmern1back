const mongoose = require("mongoose");

const { logger } = require("../utils/logger/loggerUtils");

const temp=async()=>{
  mongoose. connect(
    await process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  }.then(logger.info("Connected to db")).catch(err){console.log(err)}
  )
}
module.exports=temp
