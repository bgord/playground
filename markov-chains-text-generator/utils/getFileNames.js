const { readdir, readFile } = require("fs");
const { promisify } = require("util");

const getFileNames = promisify(readdir);

module.exports = { getFileNames };
