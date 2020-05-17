const path = require('path')
const fs   = require('fs')

const save_mappings = (apk_dirpath, smali_dirs_data) => {
  const log_filepath = path.join(apk_dirpath, 'rauf.mappings.txt')

  fs.writeFileSync(
    log_filepath,
    JSON.stringify(smali_dirs_data, null, 2),
    {encoding: 'utf8'}
  )
}

module.exports = save_mappings
