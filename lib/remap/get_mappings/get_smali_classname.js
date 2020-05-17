const path     = require('path')
const fs       = require('fs')
const readline = require('readline')
const events   = require('events')

// -----------------------------------------------------------------------------

const get_smali_classname_from_file_path = (smali_root_dir, smali_filepath) => {
  const prefix = smali_root_dir + path.sep
  const suffix = '.smali'
  let smali_classname

  smali_classname = smali_filepath.substring(prefix.length)
  smali_classname = smali_classname.substring(0, (smali_classname.length - suffix.length))
  if (path.sep !== '/')
    smali_classname = smali_classname.split(path.sep).join('/')
  smali_classname = 'L' + smali_classname + ';'

  return smali_classname
}

// -----------------------------------------------------------------------------

const get_smali_classname_from_file_content = async (smali_root_dir, smali_filepath) => {
  const prefix = '.class'
  const regex  = /^\.class\s+(?:.*\s+)?(L.*?;)$/
  let smali_classname

  // -------------------------------------------
  // based on:
  //   https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
  // -------------------------------------------

  const rl = readline.createInterface({
    input: fs.createReadStream(smali_filepath),
    crlfDelay: Infinity
  })

  rl.on('line', (line) => {
    if (line.indexOf(prefix) === 0) {
      if (regex.test(line)) {
        smali_classname = line.replace(regex, '$1')
        rl.close()
      }
    }
  })

  await events.once(rl, 'close')

  // fallback
  if (!smali_classname)
    smali_classname = get_smali_classname_from_file_path(smali_root_dir, smali_filepath)

  return smali_classname
}

// -----------------------------------------------------------------------------

module.exports = {
  from_file_path:    get_smali_classname_from_file_path,
  from_file_content: get_smali_classname_from_file_content
}
