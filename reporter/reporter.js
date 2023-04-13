const mocha = require("mocha");
const fs = require("fs");
const path = require("path");
module.exports = MyReporter;

function MyReporter(runner) {
  mocha.reporters.Base.call(this, runner);
  let fileName;
  let tests = [];

  runner.on("suite", function (test) {
    // suite gets overwritten in subsequent events??
    if (fileName == null) {
      fileName = test.file;
    }
  });

  runner.on("test", function (test) {
    tests.push(test.fullTitle());
  });

  runner.on("end", function () {
    function cleanseTestName(test) {
      const pattern = /[^A-Za-z0-9\s]/;
      return test.replace(pattern, "");
    }
    const result = tests
      .map((test) => `${fileName},${cleanseTestName(test)}`)
      .join("\n");

    // split by path, reverse to get filename, split by '.' to remove extensions
    const outputFileName = `${
      fileName.split("/").reverse()[0].split(".")[0]
    }.csv`;

    console.log(`Writing out file ${outputFileName}`);
    fs.writeFileSync(
      path.resolve(path.join("reporter/output", outputFileName)),
      `${result}\n`, //trailing newline for concat purposes
      {
        encoding: "utf-8",
      }
    );
  });
}
