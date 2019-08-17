const _throw = require("./_throw");
const { textsDir } = require("../config");

const isDirEmpty = dirFilesArray =>
  dirFilesArray.length === 0
    ? _throw(`Empty "${textsDir}" directory. Please, append some files.`)
    : dirFilesArray;

module.exports = { isDirEmpty };
