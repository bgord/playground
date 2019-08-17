const { excludeChars } = require("../config");

const cleanFileRegExp = new RegExp(`${excludeChars.join("|")}`, "g");
const cleanFileContent = file => file.replace(cleanFileRegExp, "");

const cleanFiles = files => files.map(cleanFileContent);

module.exports = { cleanFiles };
