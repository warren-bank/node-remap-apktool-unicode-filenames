const get_mappings     = require('./remap/get_mappings')
const save_mappings    = require('./remap/save_mappings')
const process_mappings = require('./remap/process_mappings')
const die              = require('./helpers/die')

const remap = async (apk_dirpath) => {
  const smali_dirs_data = await get_mappings(apk_dirpath)

  if (!smali_dirs_data)
    die('path to decoded apk directory does not contain a smali subdirectory')

  if (!smali_dirs_data.mappings.length)
    die(`no filenames containing unicode found within the ${(smali_dirs_data.root_dirs.length === 1) ? 'smali directory' : `${smali_dirs_data.root_dirs.length} smali directories`}`, true)

  save_mappings(apk_dirpath, smali_dirs_data)

  await process_mappings(apk_dirpath, smali_dirs_data)

  die(`remapped ${smali_dirs_data.mappings.length} filenames containing unicode within the ${(smali_dirs_data.root_dirs.length === 1) ? 'smali directory' : `${smali_dirs_data.root_dirs.length} smali directories`}`, true)
}

module.exports = remap
