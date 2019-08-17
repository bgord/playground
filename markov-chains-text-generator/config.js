const config = {
  textsDir: "./texts",
  allowedExts: [".txt"],
  excludeChars: ["\r", "\t", "\n"],
  chainLength: 50,
  logsDir: "./logs.txt",
  modelDir: "./markovModel.json",
  chainDir: "./markovChain.txt"
};

module.exports = config;
