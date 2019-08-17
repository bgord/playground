const { allowedExts } = require("../config");

const createExtsRegExp = allowedExts => new RegExp(`${allowedExts.join("|")}$`);
const createExtsFilter = allowedExts => name =>
  createExtsRegExp(allowedExts).test(name);
const containsExts = createExtsFilter(allowedExts);

const containsOneDot = filename =>
  filename.split("").reduce(dotCounter, 0) === 1 ? true : false;
const dotCounter = (counter, char) => (counter += char === ".");

const noEmptyNames = exts => filename => !exts.find(isEqual(filename));
const isEqual = filename => ext => ext === filename;

const filterExts = names =>
  names
    .filter(containsExts)
    .filter(containsOneDot)
    .filter(noEmptyNames(allowedExts));

module.exports = { filterExts };
