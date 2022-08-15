const express = require("express");

const { Router } = express;

const { login, checkCredentials } = require("./controller");
const { locals, parseMongoError } = require("../base/controller");

const User = require("./model");
const logger = require("../../services/logger");

const router = Router();

router
  .get("/logout", checkCredentials, locals, async (req, res) => {
    try {
      req.session.destroy();

      res.redirect("/user/login");
    } catch (error) {
      logger.error(error);

      res.render("user/views/login", { error: error.toString() });
    }
  })
  .get("/login", locals, async (req, res) => {
    try {
      res.render("user/views/login", { message: req.query.message, error: req.query.error });
    } catch (error) {
      logger.error(error);

      res.render("user/views/login", { error: error.toString() });
    }
  })
  .post("/login", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await login(email, password);

      if (!user) return res.render("user/views/login", { error: "Invalid credentials" });

      req.session.user = { _id: user._id };

      res.redirect("/");
    } catch (error) {
      logger.error(error);

      res.render("user/views/login", { error: error.toString() });
    }
  })
  .get("/register", locals, async (req, res) => {
    try {
      res.render("user/views/register");
    } catch (error) {
      logger.error(error);

      res.render("user/views/register", { error: error.toString() });
    }
  })
  .post("/register", async (req, res) => {
    try {
      const { firstname, email, password, _password } = req.body;

      if (!email || !password) return res.render("user/views/register", { error: "Please, enter email and password." });
      if (password !== _password) return res.render("user/views/register", { error: "Password not match." });

      if (await User.findOne({ email })) return res.render("user/views/register", { error: "Try another email." });

      const payload = { email, password };

      if (firstname) payload.firstname = firstname;

      const user = await User.create(payload);

      req.session.user = { _id: user._id };

      res.redirect("/");
    } catch (error) {
      logger.error(error);

      res.render("user/views/register", { error: parseMongoError(error) });
    }
  })
  .get("/update", checkCredentials, locals, async (req, res) => {
    try {
      res.render("user/views/update", { message: req.query.message, error: req.query.error });
    } catch (error) {
      logger.error(error);

      res.render("user/views/update", { error: error.toString() });
    }
  })
  .post("/update", checkCredentials, locals, async (req, res) => {
    try {
      const { password, _password, token } = req.body;

      if ((password || _password) && password !== _password) return res.render("users/register", { error: "Password not match." });

      const payload = {};

      Object.keys(req.body).forEach(key => {
        if (Boolean(req.body[key])) {
          payload[key] = req.body[key];
        }
      });

      payload.updatedAt = Date.now();
      payload.updatedBy = req.session.user._id;

      await User.createOrUpdate({ _id: req.session.user._id }, payload);

      res.redirect("/");
    } catch (error) {
      logger.error(error);

      res.render("user/views/update", { error: parseMongoError(error) });
    }
  });

module.exports = router;
