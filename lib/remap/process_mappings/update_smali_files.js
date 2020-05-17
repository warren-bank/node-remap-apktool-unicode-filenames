const replaceAll = require('../../helpers/replaceAll')
const path       = require('path')
const fs         = require('fs')
const readline   = require('readline')
const events     = require('events')

const modify_smali_file_line = (line, smali_dirs_data) => {
  const args = {subject: line}

  smali_dirs_data.mappings.forEach(mapping => {
    args.search  = mapping.old.classname
    args.replace = mapping.new.classname

    replaceAll(args)
  })

  return {new_line: args.subject, counter: args.counter}
}

const update_smali_file = async (smali_filepath, smali_dirs_data) => {
  const file_lines = []
  let   is_changed = false

  // -------------------------------------------
  // based on:
  //   https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
  // -------------------------------------------

  const rl = readline.createInterface({
    input: fs.createReadStream(smali_filepath),
    crlfDelay: Infinity
  })

  rl.on('line', (line) => {
    const {new_line, counter} = modify_smali_file_line(line, smali_dirs_data)
    file_lines.push(new_line)
    is_changed = is_changed || !!counter
  })

  await events.once(rl, 'close')

  if (is_changed) {
    fs.writeFileSync(
      smali_filepath,
      file_lines.join("\n"),
      {encoding: 'utf8'}
    )
  }

  file_lines.splice(0, file_lines.length)
}

const update_smali_files = async (smali_dirs_data) => {
  for (let i=0; i < smali_dirs_data.files.length; i++) {
    await update_smali_file(smali_dirs_data.files[i], smali_dirs_data)
  }
}

module.exports = update_smali_files
