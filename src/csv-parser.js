const fs = require("fs");
const { Transform } = require("stream");

function csvToJson(array, headers, delimeter, escapeChar, skipError) {
  let result = [];
  array = array.filter(Boolean);
  array.forEach((element) => {
    try {
      if (element[0] !== "#") {
        const rowValue = splitString(delimeter, element, escapeChar);
        const rowObj = {};
        for (const index in rowValue) {
          if (headers.length) {
            rowObj[headers[index]] = rowValue[index];
          } else {
            rowObj[index] = rowValue[index];
          }
        }
        result.push(rowObj);
      }
    } catch (error) {
      if (skipError) {
        console.warn(`Failed to parse ${chunkNumber}. skipping it`);
      } else {
        throw new Error(`Failed to parse csv \n ERROR: ${error}`);
      }
    }
  });

  return result;
}

function splitString(splitChar, str, escapeChar) {
  try {
    const splitedArr = [];
    let newStr = "";
    let escapeThisChar = false;
    for (char of str + splitChar) {
      if (escapeChar === char) {
        escapeThisChar = !escapeThisChar;
      }
      if (char !== splitChar || escapeThisChar) {
        newStr += char;
      } else {
        splitedArr.push(newStr);
        newStr = "";
      }
    }
    return splitedArr;
  } catch (error) {
    console.error(`Failed to parse ${error}`);
  }
}

function skipCommentedLineHeader(arr, index) {
  try {
    index = index;
    if (arr[index][0] === "#") {
      arr.splice(index, 1);
      skipCommentedLineHeader(arr, index);
    }
    return arr;
  } catch (error) {
    console.error(`Failed to parse ${error}`);
  }
}

function csvFileToJsonSync(sourceFilePath, options) {
  try {
    const rs = fs.createReadStream(sourceFilePath);
    const transformStream = new Transform();
    rs.setEncoding("utf8");
    let chunkNumber = 0;
    let headers = [];
    rs.on("data", function (chunk) {
      let array = chunk.toString().split("\n");
      if (options.header && chunkNumber === 0) {
        array = skipCommentedLineHeader(array, 0);
        headers = splitString(
          options.delimeter,
          array.splice(0, 1)[0],
          options.escape
        );
      }
      const result = csvToJson(
        array,
        headers,
        options.delimeter,
        options.escape,
        options.skipError,
      );
      transformStream.push(JSON.stringify(result));
      chunkNumber += 1;
    })
    return transformStream;
  } catch (error) {
    if (options.skipError) {
      console.warn(`Failed to parse ${chunkNumber}. skipping it`);
    } else {
      throw new Error(`Failed to parse csv \n ERROR: ${error}`);
    }
  }
}

module.exports = {
  csvFileToJsonSync,
};
