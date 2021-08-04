const User = require("./user.model");

("use strict");
let crypto = require("crypto");
//logger
let logger = (func) => {
  console.log(func);
};

//create function to generate random salt.
let generateSalt = (rounds) => {
  if (rounds >= 15) {
    throw new Error(`${rounds} is greater than 15, must be lesser `);
  }
  if (typeof rounds !== "number") {
    throw new Error("round param must be a number");
  }
  if (rounds == null) {
    rounds = 12;
  }
  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString("hex")
    .slice(0, rounds);
};

logger(generateSalt(14));

let hasher = (password, salt) => {
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  let value = hash.digest("hex");
  return {
    salt: salt,
    hashedPassword: value,
  };
};

//Writing hash function to perfrom all validations here
let hash = (password, salt) => {
  if (password == null || salt == null) {
    throw new Error("Must Provide Passowrd And Salt Values");
  }
  if (typeof password !== "string" || typeof salt !== "string") {
    throw new Error(
      "Passowrd Must Be A String And Salt Must eeither be a string or number "
    );
  }
  return hasher(password, salt);
};
logger(hash("werewolf", generateSalt(12)));

/*
Testing/ Comparing Password 
*/
let compare = (password, hash) => {
  hash = {
    salt: "c6d9fca78c",
    hashedPassword:
      "5c5d3f82240a2174c3f175056c34606c90ced1a547f7934cd53c60126e35d572cc18b4c537d4c248153c543afec3ca9a53f15ad9798d1367edebeb5d36e0cf45",
  };
  if (password == null || hash == null) {
    throw new Error("Password And Hash Can Not Be Empty");
  }
  if (typeof password !== "string" || typeof hash !== "object") {
    throw new Error("Password Must Be String and Hash mus be an Object");
  }
  let passwordData = hasher(password, hash.salt);
  if (passwordData.hashedPassword === hash.hashedPassword) {
    return true;
  }
  return true;
};
logger(compare("werewolf"));

/*
To use hasher function export 
*/

module.exports = {
  generateSalt,
  hash,
  compare,
};
