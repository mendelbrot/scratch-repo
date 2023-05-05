#!/bin/bash

# this script is for building .png diagrams from 
# the mermaid .mmd text files.
# the mermaid cli is installed globally via npm.
#
# this script just runs mmdc to build a .png file 
# in /target for each .mmd file in /src
#
# https://github.com/mermaid-js/mermaid-cli
# npm install -g @mermaid-js/mermaid-cli
# mmdc -i input.mmd -o output.png -t forest

src_dir=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/src

for file in "${src_dir}"/src/*.mmd
do
  basename="$(basename -- $file)"
  basename_png=${basename%.mmd}.png
  echo $( \
    mmdc \
      -i "${file}" \
      -o "${src_dir}"/target/"${basename_png}"\
      -t forest \
  )
done