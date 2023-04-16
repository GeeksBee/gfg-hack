const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use("/api/auth", require("./controllers/auth"));
app.use("/api/shipment", require("./controllers/shipment"));
app.use("/api/port", require("./controllers/port"));

app.get("/", (req, res) => {
  res.json({ message: "alive" });
});

app.get("/api", (req, res) => {
  res.json({ message: "alive" });
});

module.exports = app;

// test
