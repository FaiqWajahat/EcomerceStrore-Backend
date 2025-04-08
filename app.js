const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const env = require("dotenv");
env.config();
const port = process.env.PORT || 8080;

require("./Models/db");

const routes = require("./Routes/routes");
app.use("/", routes);

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
