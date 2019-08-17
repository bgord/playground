const { isDirEmpty } = require("../utils");
const { textsDir } = require("../config");

test("isDirEmpty should throw an error when empty", () => {
  const emptyArray = [];
  expect(() => {
    isDirEmpty(emptyArray);
  }).toThrow(`Empty "${textsDir}" directory. Please, append some files.`);
});

test("isDirEmpty should return given dir files array when not empty", () => {
  const notEmptyArray = ["text1.txt,", "text2.txt"];
  expect(isDirEmpty(notEmptyArray)).toBe(notEmptyArray);
});
