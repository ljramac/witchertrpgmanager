const { promises: fs } = require("fs");

const scanFiles = async root => {
  const result = [];

  const scan = async origin => {
    const childs = await fs.readdir(origin);

    for (const child of childs) {
      const childPath = `${origin}/${child}`;

      if (!/\.json/.test(childPath)) {
        await scan(childPath);
      } else {
        result.push(childPath);
      }
    }
  };

  await scan(root);

  return result;
};

const getFixtures = async () => {
  const files = await scanFiles("./fixtures");

  return files;
};

module.exports = { getFixtures };
