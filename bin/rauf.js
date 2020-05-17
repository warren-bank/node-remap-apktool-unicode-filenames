#! /usr/bin/env node

const remap = require('../lib/remap')
const die   = require('../lib/helpers/die')
const path  = require('path')
const fs    = require('fs')

const rauf = async () => {
  if (!process.argv || process.argv.length <= 2)
    die('missing required parameter: path to decoded apk directory')

  const apk_dirpath = path.resolve(process.argv[2])

  if (!fs.existsSync(apk_dirpath))
    die('path to decoded apk directory does not exist')

  {
    const fsstats = fs.lstatSync(apk_dirpath)
    if (! fsstats.isDirectory())
      die('path to decoded apk directory refers to a regular file')
  }

  console.log('rauf is remapping smali unicode filenames..')
  await remap(apk_dirpath)
}

rauf()
