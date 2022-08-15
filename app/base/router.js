const express = require("express");

const { Router } = express;

const { checkCredentials } = require("../user/controller");
const { locals } = require("./controller");

const logger = require("../../services/logger");

const router = Router();

router
  .get("/", checkCredentials, locals, async (req, res) => {
    try {
      res.render("base/views/index");
    } catch (error) {
      logger.error(error);

      res.render("base/views/index", { error: error.toString() });
    }
  });

module.exports = router;
