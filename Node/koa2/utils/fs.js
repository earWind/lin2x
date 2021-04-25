const fs = require("fs");
const path = require("path");

// 读取文件
function readFile(_path) {
  const mypath = path.join(__dirname, _path);
  return new Promise((resolve, reject) => {
    fs.readFile(mypath, (err, data) => {
      if (err) throw err;
      resolve(data.toString());
    });
  });
}

module.exports = {
  readFile,
};
