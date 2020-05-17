const path = require('path')
const fs   = require('fs')

// -----------------------------------------------------------------------------

const get_xml_dirs = (apk_dirpath) => {
  // only search 1 level deep under '/res' and return directories that begin with ['layout','xml']

  const xml_dirs = []

  const res_dirpath = path.join(apk_dirpath, 'res')
  if (!fs.existsSync(res_dirpath))
    return xml_dirs

  const fsdirents = fs.readdirSync(res_dirpath, {encoding: 'utf8', withFileTypes: true})

  if (!fsdirents || !fsdirents.length)
    return xml_dirs

  fsdirents.forEach(fsdirent => {
    if (!fsdirent.isDirectory())
      return

    if ((fsdirent.name.indexOf('layout') !== 0) && (fsdirent.name.indexOf('xml') !== 0))
      return

    xml_dirs.push(path.join(res_dirpath, fsdirent.name))
  })

  return xml_dirs
}

// -----------------------------------------------------------------------------

const process_xml_dir = (xml_dir, xml_files) => {
  // only search 1 level deep for all xml files
  // append findings to 'xml_files' (inplace by reference).

  const fsdirents = fs.readdirSync(xml_dir, {encoding: 'utf8', withFileTypes: true})

  if (!fsdirents || !fsdirents.length)
    return

  fsdirents.forEach(fsdirent => {
    const filepath = path.join(xml_dir, fsdirent.name)

    if (fsdirent.isFile() && (path.extname(fsdirent.name) === '.xml'))
      xml_files.push(filepath)
  })
}

// -----------------------------------------------------------------------------

const get_xml_resources = (apk_dirpath) => {
  const xml_dirs  = get_xml_dirs(apk_dirpath)
  const xml_files = []

  xml_dirs.forEach(xml_dir => {
    process_xml_dir(xml_dir, xml_files)
  })

  return xml_files
}

module.exports = get_xml_resources
