const _throw = require("../utils/_throw");

test("_throw should throw given message", () => {
  const msg = "Wrong file extension!";
  expect(() => {
    _throw(msg);
  }).toThrow(msg);
});
