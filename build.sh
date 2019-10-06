#!/bin/bash
workdir=$PWD
cd `dirname "$0"`
rm -rf dist
rm -rf target
npx tsc
npx webpack --entry ./target/index.js --output-filename index.js
npx node-sass index.scss > index.css
cd $workdir
