const { writeFile } = require("fs");
const { modelDir } = require("../config");

const noEmptyWords = word => word !== "" && word !== " ";
const getLastArrElem = arr => arr[arr.length - 1];
const isNotAppended = (markovModel, word) => !markovModel.hasOwnProperty(word);

const createMarkovModel = text => {
  const textArr = text.split(" ").filter(noEmptyWords);
  const lastWord = getLastArrElem(textArr);
  let markovModel = {};
  for (let i = 0; i < textArr.length - 1; i++) {
    let currentWord = textArr[i];
    let nextWord = textArr[i + 1];
    if (isNotAppended(markovModel, currentWord)) {
      markovModel[currentWord] = [nextWord];
    } else {
      markovModel[currentWord].push(nextWord);
    }
  }
  writeFile(modelDir, JSON.stringify(markovModel), err => {});
  return { markovModel, lastWord };
};

module.exports = { createMarkovModel };
