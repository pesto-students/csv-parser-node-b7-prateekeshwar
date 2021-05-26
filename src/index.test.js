const { csvFileToJsonSync } = require("./csv-parser");
const path = require("path");
var stream = require("stream");
const sourceFilePath = path.resolve("./assets/query_test3.csv");
const options = {
  header: true,
  delimeter: ",",
  escape: '"',
  skipError: true,
};
const result = csvFileToJsonSync(sourceFilePath, options);

describe("csvFileToJsonSync", () => {
  test("should return a type object", () => {
    expect(typeof result).toEqual("object");
  });

  test("should return the result as instance of stream", () => {
    expect(result instanceof stream.Stream).toBe(true);
    expect(typeof result._read).toBe("function");
    expect(typeof result._readableState).toBe("object");
  });

  test("should return the chunk in buffer object", () => {
    result.on("data", (chunk) => {
      expect(typeof chunk).toBe("object");
      expect(Buffer.isBuffer(chunk)).toBe(true);
      expect(chunk.toString()).toBe(
        '[{"Screen name":"mobile no. empty state","status":"done","developer":"ps","APi dependency":"yes"},{"Screen name":"enter pin code","status":"partially done","developer":"ps","APi dependency":"yes"},{"Screen name":"language","status":"not done","developer":"","APi dependency":"yes"}]'
      );
    });
  });
});
