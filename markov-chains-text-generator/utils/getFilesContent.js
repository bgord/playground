const { readFile } = require("fs");
const { promisify } = require("util");
const { textsDir } = require("../config");

const getFileContent = promisify(readFile);

const createFileDir = name => `${textsDir}/${name}`;
const bufferToStr = buffer => buffer.toString();

const filterEmptyFiles = filenames => filenames.filter(noEmpty);
const noEmpty = name => name !== "" && name !== " ";

const getFilesContent = names =>
  Promise.all(names.map(name => getFileContent(createFileDir(name))))
    .then(buffers => buffers.map(bufferToStr))
    .then(filterEmptyFiles);

module.exports = { getFilesContent };
