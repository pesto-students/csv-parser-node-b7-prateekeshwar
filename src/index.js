#!/usr/bin/env node

'use strict';

const { csvFileToJsonSync } = require('./csv-parser')
var stream = require('stream');
const minimist = require('minimist');
const fs = require('fs')
const path = require('path');

const args = minimist(process.argv.slice(2), {
    boolean: ['header', 'skipError'],
    string: ['file', 'delimeter', 'escape'],
  });

if (args.help || (!args.file)) {
  console.error(`Usage: csv-parser [file?] [options]
  --escape         Set the escape character (defaults to quote value)
  --header         Explicitly specify csv headers as a comma separated list(default=false)
  --help           Show this help
  --delimeter      Set the separator character ("," by default)
  --skipError      Set skip error boolean(false by default)
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
escape: args.escape || '"',
skipError: args.skipError,
}

const result = csvFileToJsonSync(sourceFilePath, options)
result.on('data', (chunk) => {
        console.log(chunk.toString());
})
