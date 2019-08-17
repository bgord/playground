const { filterExts } = require("../utils/filterExts");

test("filterExts should return only files with given extensions", () => {
  const givenFiles = [
    "text.txt",
    "text.2x2",
    "text.md",
    "text.txt.js",
    "text.",
    ".txt",
    ".md",
    "text.js.txt"
  ];
  const outupFiles = ["text.txt"];
  expect(filterExts(givenFiles)).toEqual(outupFiles);
});
