const { scanFiles } = require("../controller");

const getFixtures = async () => {
  const files = await scanFiles("./fixtures", new RegExp(".json"));

  return files;
};

module.exports = { getFixtures };
