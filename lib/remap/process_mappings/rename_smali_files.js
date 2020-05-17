const fs = require('fs')

const rename_smali_files = (smali_dirs_data) => {
  smali_dirs_data.mappings.forEach(mapping => {
    fs.renameSync(mapping.old.filepath, mapping.new.filepath)
  })
}

module.exports = rename_smali_files
