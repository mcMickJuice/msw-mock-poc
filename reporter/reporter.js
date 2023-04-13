var mocha = require("mocha");
module.exports = MyReporter;

function MyReporter(runner) {
  mocha.reporters.Base.call(this, runner);
  var fileName;
  var tests = [];

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
    console.log(result);
  });
}
