const _throw = require("./_throw");
const { chainLength, logsDir, chainDir } = require("../config");
const { writeFile, appendFile } = require("fs");

const getRandArrElem = arr => arr[Math.floor(Math.random() * arr.length)];

const log = (current, arr) =>
  `==================
  CURRENT WORD: ${current}
  CURRENT ARR:  ${arr}
  `;

const logStarters = starters => `POSSIBLE STARTERS: ${starters}\n`;

const getStarters = arr => arr.filter(isUpperCased);

const isUpperCased = word =>
  word[0] === word[0].toUpperCase() &&
  word[0] !== "(" &&
  word[0] !== '"' &&
  word[0] !== "'" &&
  word[0] !== "-" &&
  word[0] !== "„" &&
  word[0] !== "[" &&
  word[0] !== ".";

const createLogger = func => logsDir => content =>
  func(logsDir, content, () => {});

const endsWithDot = text => text[text.length - 1] !== ".";

const generateMarkovChain = ({ markovModel, lastWord }) => {
  const starters = getStarters(Object.keys(markovModel));
  createLogger(writeFile)(logsDir)(logStarters(starters));
  const starter = getRandArrElem(starters);
  let text = `${starter}`;
  let currentWord = starter;
  for (let i = 0; i < chainLength; i++) {
    createLogger(appendFile)(logsDir)(
      log(currentWord, markovModel[currentWord])
    );
    const nextWord = getRandArrElem(markovModel[currentWord]);
    text += " " + nextWord;
    currentWord = nextWord;
    if (nextWord === lastWord) break;
  }
  if (!endsWithDot(text)) {
    text += ".";
  }
  createLogger(writeFile)(chainDir)(text);
  return text;
};

module.exports = { generateMarkovChain };
