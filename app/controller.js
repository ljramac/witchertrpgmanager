const { promises: fs } = require("fs");
const path = require("path");
const _ = require("lodash");
const { Job, Race } = require("./character/model");
const { Kingdom, Region } = require("./world/model");
const logger = require("../services/logger");

const getModel = model => {
  switch (model) {
    case "job":
      return Job;
    case "race":
      return Race;
    case "kingdom":
      return Kingdom;
    case "region":
      return Region;
    default:
      return null
  }
};

const populateDB = async () => {
  try {
    const seeds = await getSeeds();

    for (const seed of seeds) {
      const model = getModel(path.parse(seed).name);

      if (model) {
        if ((await model.find({}).limit(1)).length) continue;

        logger.debug(`Populating: ${model.modelName}`);

        const data = require(path.resolve(seed));

        await model.insertMany(data);
      }
    }
  } catch (error) {
    throw error;
  }
};

const scanFiles = async (root, regex) => {
  const result = [];

  const scan = async origin => {
    const childs = await fs.readdir(origin);

    for (const child of childs) {
      const childPath = `${origin}/${child}`;

      const isDirectory = (await fs.stat(childPath)).isDirectory();

      if (isDirectory) {
        await scan(childPath);
      } else if (regex.test(childPath)) {
        result.push(childPath);
      }
    }
  };

  await scan(root);

  return result;
};

const getSeeds = async () => {
  const files = await scanFiles("./app", new RegExp("seeds/.*.json"));

  return files;
};

module.exports = { scanFiles, getSeeds, populateDB };
