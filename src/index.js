#!/usr/bin/env node

'use strict';

const { csvFileToJsonSync } = require('./csv-parser')
const minimist = require('minimist');
const fs = require('fs')
const path = require('path');

const args = minimist(process.argv.slice(2), {
    boolean: ['header'],
    string: ['file', 'delimeter', 'escape'],
  });

console.log("test args man", args)
if (args.help || (!args.file)) {
  console.error(`Usage: csv-parser [file?] [options]
  --escape         Set the escape character (defaults to quote value)
  --header         Explicitly specify csv headers as a comma separated list(default=false)
  --help           Show this help
  --delimeter      Set the separator character ("," by default)
`)
  process.exit(0)
}

if (args.delimeter && ![',', ';', '\t'].includes(args.delimeter)) {
    console.error('Only comma(,), semi colon(;), and tab spaces(\t) are allowed in delimeter')
    process.exit(1)
}

const sourceFilePath = path.resolve(args.file)

const options = {
header : args.header,
delimeter : args.delimeter || ',',
escape: args.escape || '"'
}

const result = csvFileToJsonSync(sourceFilePath, options)
// const ter= [].toString
console.log("dddddd")
result.setEncoding('utf8')
// console.log(result)
console.log('result--JSON');
result.on('data', (chunk) => {
  console.log(chunk);
});
