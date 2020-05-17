const update_smali_files = require('./process_mappings/update_smali_files')
const rename_smali_files = require('./process_mappings/rename_smali_files')
const update_xml_files   = require('./process_mappings/update_xml_files')

const process_mappings = async (apk_dirpath, smali_dirs_data) => {
  await update_smali_files(smali_dirs_data)
  await update_xml_files(apk_dirpath, smali_dirs_data)

  rename_smali_files(smali_dirs_data)
}

module.exports = process_mappings
