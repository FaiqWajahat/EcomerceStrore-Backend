const express = require("express");
const app = express();
app.use(express.json({ limit: "50mb" }));
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const env = require("dotenv");
env.config();
const port = process.env.PORT || 8080;

require("./Models/db");

const routes = require("./Routes/routes");
const adminRouter = require("./Routes/adminRoutes");

app.use("/", routes);
app.use("/admin", adminRouter);

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
