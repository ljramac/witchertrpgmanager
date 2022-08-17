const path = require("path");
const _ = require("lodash");
const express = require("express");

const { Router } = express;

const { checkCredentials } = require("../user/controller");
const { locals } = require("../base/controller");

const logger = require("../../services/logger");

const { getFixtures } = require("./controller");

const router = Router();

router
  .get("/", checkCredentials, locals, async (req, res) => {
    try {
      const fixtures = await getFixtures();

      const locals = { common: {}, witcher: {} };

      for (const fixture of fixtures) {
        const fx = require(path.resolve(fixture));

        const category = /common/.test(fixture) ? "common" : "witcher";

        locals[category][_.camelCase(path.parse(fixture).name)] = fx;
      }

      res.render("character/views/index", { fixtures: locals });
    } catch (error) {
      logger.error(error);

      res.render("character/views/index", { error: error.toString() });
    }
  });

module.exports = router;
