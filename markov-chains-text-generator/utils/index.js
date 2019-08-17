const { getFileNames } = require("./getFileNames");
const { isDirEmpty } = require("./isDirEmpty");
const { filterExts } = require("./filterExts");
const { getFilesContent } = require("./getFilesContent");
const { mergeFiles } = require("./mergeFiles");
const { cleanFiles } = require("./cleanFiles");
const { createMarkovModel } = require("./createMarkovModel");
const { generateMarkovChain } = require("./generateMarkovChain");

module.exports = {
  getFileNames,
  isDirEmpty,
  filterExts,
  getFilesContent,
  cleanFiles,
  mergeFiles,
  createMarkovModel,
  generateMarkovChain
};
