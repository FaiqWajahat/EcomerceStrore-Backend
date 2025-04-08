const mongoose = require("mongoose");
const env = require("dotenv")
env.config()
 
mongoose
  .connect(process.env.DB_Connection)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("database is not connected", err);
  });
