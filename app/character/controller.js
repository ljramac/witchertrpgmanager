const path = require("path");
const _ = require("lodash");

const { Job, Race } = require("./model");
const { Kingdom, Region } = require("../world/model");

const { scanFiles } = require("../controller");

const getFixtures = async () => {
  const files = await scanFiles("./fixtures", new RegExp(".json"));

  return files;
};

const getCreationData = async () => {
  const fixtures = { common: {}, witcher: {} };
  const models = {
    jobs: [],
    races: [],
    kingdoms: [],
    regions: []
  };

  const _fixtures = await getFixtures();

  for (const fixture of _fixtures) {
    const _fixture = require(path.resolve(fixture));

    const category = /common/.test(fixture) ? "common" : "witcher";

    fixtures[category][_.camelCase(path.parse(fixture).name)] = _fixture;
  }

  for (const model of [Job, Race, Kingdom, Region]) {
    models[model.modelName.toLowerCase() + "s"] = await model.find({}).lean();
  }

  return { models, fixtures };
};

module.exports = { getFixtures, getCreationData };
