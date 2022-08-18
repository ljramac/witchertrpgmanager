const express = require("express");

const { Router } = express;

const { checkCredentials } = require("../user/controller");
const { locals } = require("../base/controller");

const logger = require("../../services/logger");

const { getCreationData } = require("./controller");

const router = Router();

router
  .get("/", checkCredentials, locals, async (req, res) => {
    try {

      const locals = await getCreationData();

      res.render("character/views/index", locals);
    } catch (error) {
      logger.error(error);

      res.render("character/views/index", { error: error.toString() });
    }
  });

module.exports = router;
