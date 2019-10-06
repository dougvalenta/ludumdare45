#!/bin/bash
workdir=$PWD
cd `dirname "$0"`
./build.sh || exit 1
http-server ./
cd $workdir