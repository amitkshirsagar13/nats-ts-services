#!/bin/bash
pkgs=$1
echo $pkgs
WORK_DIR=`pwd`
export IFS="|"
for lib in $pkgs; do
  DIR="src/pkgs/@amitkshirsagar13/$lib"
  if [[ -d "$DIR" ]]; then
    cd "src/pkgs/@amitkshirsagar13/$lib" 
    echo "Publishing @amitkshirsagar13/$lib"
    npm publish
    cd $WORK_DIR
    echo "Published @amitkshirsagar13/$lib"
  else 
    echo "Skipped published @amitkshirsagar13/$lib from $DIR"
  fi
  
done
