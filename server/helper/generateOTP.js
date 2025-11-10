const crypto = require("crypto");

const generateOTP = () => {
  const buffer = crypto.randomBytes(3);
  const randomNumber = parseInt(buffer.toString("hex"), 16);
  const sixDigitNumber = randomNumber % 1000000;
  return sixDigitNumber.toString().padStart(6, "0");
};

module.exports = generateOTP;
