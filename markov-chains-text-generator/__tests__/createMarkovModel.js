const { createMarkovModel } = require("../utils/createMarkovModel");

describe("createMarkovModel", () => {
  it("should work properly", () => {
    const text = "Ala ma kota. Kot ma Alę.";
    const result = {
      markovModel: {
        Ala: ["ma"],
        ma: ["kota.", "Alę."],
        "kota.": ["Kot"],
        Kot: ["ma"]
      },
      lastWord: "Alę."
    };
    expect(createMarkovModel(text)).toEqual(result);
  });
});
