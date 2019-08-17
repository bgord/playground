const { unlink } = require("fs");
const { promisify } = require("util");
const { logsDir, modelDir, chainDir } = require("./config");

const deleteFile = promisify(unlink);

Promise.all([
  deleteFile(logsDir),
  deleteFile(modelDir),
  deleteFile(chainDir)
]).catch(err => {
  console.log(err);
});
