const totp = require("otplib/totp");
const crypto = require("crypto");
totp.options = { crypto };
totp.options.step = 60;
const secret = "HELLO";
const token = totp.generate(secret);
let isVerify = true;
while (isVerify) {
  isVerify = totp.check(token, secret);
  console.log(totp.timeRemaining());
}
console.log(totp.timeRemaining());
