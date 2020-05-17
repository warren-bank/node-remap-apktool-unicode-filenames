const get_xml_resources = require('./update_xml_files/get_xml_resources')
const replaceAll        = require('../../helpers/replaceAll')
const path              = require('path')
const fs                = require('fs')
const readline          = require('readline')
const events            = require('events')

const modify_xml_file_line = (line, smali_dirs_data, delimiter) => {
  const args = {subject: line}

  smali_dirs_data.mappings.forEach(mapping => {
    args.search  = delimiter.pre + mapping.old.packagename + delimiter.post
    args.replace = delimiter.pre + mapping.new.packagename + delimiter.post

    replaceAll(args)
  })

  return {new_line: args.subject, counter: args.counter}
}

const update_xml_file = async (xml_filepath, smali_dirs_data, delimiter) => {
  const file_lines = []
  let   is_changed = false

  // -------------------------------------------
  // based on:
  //   https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
  // -------------------------------------------

  const rl = readline.createInterface({
    input: fs.createReadStream(xml_filepath),
    crlfDelay: Infinity
  })

  rl.on('line', (line) => {
    const {new_line, counter} = modify_xml_file_line(line, smali_dirs_data, delimiter)
    file_lines.push(new_line)
    is_changed = is_changed || !!counter
  })

  await events.once(rl, 'close')

  if (is_changed) {
    fs.writeFileSync(
      xml_filepath,
      file_lines.join("\n"),
      {encoding: 'utf8'}
    )
  }

  file_lines.splice(0, file_lines.length)
}

const update_xml_manifest = async (apk_dirpath, smali_dirs_data) => {
  const xml_filepath = path.join(apk_dirpath, 'AndroidManifest.xml')
  const delimiter    = {pre: 'android:name="', post: '"'}

  if (fs.existsSync(xml_filepath))
    await update_xml_file(xml_filepath, smali_dirs_data, delimiter)
}

const update_xml_resources = async (apk_dirpath, smali_dirs_data) => {
  let delimiter
  const xml_files = get_xml_resources(apk_dirpath)

  for (let i=0; i < xml_files.length; i++) {
    delimiter = {pre: '<', post: ' '}
    await update_xml_file(xml_files[i], smali_dirs_data, delimiter)

    delimiter = {pre: '</', post: '>'}
    await update_xml_file(xml_files[i], smali_dirs_data, delimiter)
  }
}

const update_xml_files = async (apk_dirpath, smali_dirs_data) => {
  await update_xml_manifest( apk_dirpath, smali_dirs_data)
  await update_xml_resources(apk_dirpath, smali_dirs_data)
}

module.exports = update_xml_files
