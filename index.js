// file system modules
const fs = require("fs");

// read from files
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

// write to files
const textOut = `This is what we know about hte avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
