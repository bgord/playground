const {
  getFileNames,
  isDirEmpty,
  filterExts,
  getFilesContent,
  cleanFiles,
  mergeFiles,
  createMarkovModel,
  generateMarkovChain
} = require("./utils");
const { textsDir, chainLength } = require("./config");

const logger = data => {
  console.log(data);
};

getFileNames(textsDir)
  .then(isDirEmpty)
  .then(filterExts)
  .then(getFilesContent)
  .then(cleanFiles)
  .then(mergeFiles)
  .then(createMarkovModel)
  .then(generateMarkovChain)
  .then(logger)
  .catch(logger);
