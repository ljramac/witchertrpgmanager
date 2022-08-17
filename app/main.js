require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("memorystore")(session);

const userRouter = require("./user/router.js");
const baseRouter = require("./base/router.js");
const characterRouter = require("./character/router.js");

const logger = require("../services/logger");

const { locals } = require("./base/controller");
const { populateDB } = require("./controller");

const app = express();

app.use((req, res, next) => {
  res.header("X-Frame-Options", "ALLOWALL");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  cookie: { maxAge: 43200000 },
  resave: false,
  store: new MemoryStore({
    checkPeriod: 43200000
  }),
}));

app.use(express.static(path.resolve("./public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set("views", path.resolve("./app"));
app.set("view engine", "pug");

app.get("/health", (req, res) => res.sendStatus(200));

app.get("/", locals, (req, res) => res.redirect("/home"));

app.use("/user", userRouter);
app.use("/home", baseRouter);
app.use("/character", characterRouter);

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await populateDB();

    app.listen(process.env.PORT);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { init };
