#!/bin/sh

usage () {
  printf "Usage: build-umd <argument>\n"
}

# use zopfli for better compression if available
_compress () {
  zopfli -h 2>/dev/null
  if [ $? -eq 0 ]; then
    zopfli "$1" -i1000 -c
  else
    gzip -c "$1"
  fi
}

build_dev () {
  rm -rf dist/
  mkdir -p dist/
  rollup -c -f cjs -i src/index.js -o dist/gibon.cjs.js
  rollup -c -f umd -i src/index.js -o dist/gibon.umd.js -n gibon
}

build_min () {
  mkdir -p dist/
  uglifyjs dist/gibon.umd.js -cm \
    -o dist/gibon.umd.min.js \
    -p relative \
    --source-map dist/gibon.umd.min.js.map
  cp dist/gibon.umd.min.js public/dist/
  cp dist/gibon.umd.min.js.map public/dist/
}

build_gz () {
  build_min
  uglifyjs dist/gibon.cjs.js -cm -o dist/gibon.cjs.min.js
  _compress dist/gibon.cjs.min.js > dist/gibon-cjs.gz
  _compress dist/gibon.umd.min.js > dist/gibon-umd.gz
}

# parse CLI flags
while true; do
  case "$1" in
    -h|--help) usage && exit 1 ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

case "$1" in
  d|dev) shift; build_dev "$@" ;;
  m|min) shift; build_min "$@" ;;
  g|gzip) shift; build_gz "$@" ;;
  *) shift; build_min "$@" ;;
esac
