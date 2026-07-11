/* eslint-disable @typescript-eslint/no-require-imports */
require("./typescript6-require.cjs");

const path = require("node:path");

const eslintPackage = path.dirname(require.resolve("eslint/package.json"));
require(path.join(eslintPackage, "bin/eslint.js"));
