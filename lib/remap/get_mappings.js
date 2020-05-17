const get_smali_classname = require('./get_mappings/get_smali_classname')
const StringIdGenerator   = require('../helpers/StringIdGenerator')
const path                = require('path')
const fs                  = require('fs')

// -----------------------------------------------------------------------------

const get_smali_root_dirs = (apk_dirpath) => {
  // only search 1 level deep and return directories that begin with 'smali'

  const smali_root_dirs = []
  const fsdirents       = fs.readdirSync(apk_dirpath, {encoding: 'utf8', withFileTypes: true})

  if (!fsdirents || !fsdirents.length)
    return smali_root_dirs

  fsdirents.forEach(fsdirent => {
    if (!fsdirent.isDirectory())
      return

    if (fsdirent.name.indexOf('smali') !== 0)
      return

    smali_root_dirs.push(path.join(apk_dirpath, fsdirent.name))
  })

  return smali_root_dirs
}

// -----------------------------------------------------------------------------

const get_new_filename = (id_generator, smali_dir) => {
  let new_filename, new_filepath
  let is_OK = false

  while (!is_OK) {
    new_filename = id_generator.next() + '.smali'
    new_filepath = path.join(smali_dir, new_filename)

    is_OK = !fs.existsSync(new_filepath)
  }

  return {new_filename, new_filepath}
}

const get_mapping_classnames = async (smali_root_dir, old_filepath, new_filepath) => {
  const old_classname = await get_smali_classname.from_file_content(smali_root_dir, old_filepath)
  const new_classname =       get_smali_classname.from_file_path(   smali_root_dir, new_filepath)

  return {old_classname, new_classname}
}

const get_mapping_packagename = (classname) => {
  let packagename

  packagename = classname.slice(1, -1)
  packagename = packagename.split('/').join('.')

  return packagename
}

const process_smali_dir = async (smali_root_dir, smali_dir, smali_dirs_data) => {
  // recursively search all files for unicode in filenames.
  // append findings to 'smali_dirs_data' (inplace by reference).

  const fsdirents = fs.readdirSync(smali_dir, {encoding: 'utf8', withFileTypes: true})

  if (!fsdirents || !fsdirents.length)
    return

  const kMaxAssetFileName = 100
  const kInvalidChars     = /(?:[^\x20-\x7e]|[\/\\:])/
  const id_generator      = new StringIdGenerator()
  const dirs              = []

  for (let i=0; i < fsdirents.length; i++) {
    const fsdirent = fsdirents[i]
    const filepath = path.join(smali_dir, fsdirent.name)

    if (fsdirent.isFile() && (path.extname(fsdirent.name) === '.smali')) {
      smali_dirs_data.files.push(filepath)

      if ((fsdirent.name.length > kMaxAssetFileName) || kInvalidChars.test(fsdirent.name)) {
        const {new_filename,  new_filepath}  =       get_new_filename(id_generator, smali_dir)
        const {old_classname, new_classname} = await get_mapping_classnames(smali_root_dir, filepath, new_filepath)

        const mapping = {
          old: {
            filename:    fsdirent.name,
            filepath:    filepath,
            classname:   old_classname,
            packagename: get_mapping_packagename(old_classname)
          },
          new: {
            filename:    new_filename,
            filepath:    new_filepath,
            classname:   new_classname,
            packagename: get_mapping_packagename(new_classname)
          }
        }

        smali_dirs_data.mappings.push(mapping)
      }
    }

    if (fsdirent.isDirectory()) {
      smali_dirs_data.dirs.push(filepath)

      dirs.push(filepath)
    }
  }

  for (let i=0; i < dirs.length; i++) {
    const smali_subdir = dirs[i]
    await process_smali_dir(smali_root_dir, smali_subdir, smali_dirs_data)
  }
}

// -----------------------------------------------------------------------------

const get_mappings = async (apk_dirpath) => {
  const smali_root_dirs = get_smali_root_dirs(apk_dirpath)

  if (!smali_root_dirs || !smali_root_dirs.length)
    return null

  const smali_dirs_data = {
    mappings:  [],
    files:     [],
    root_dirs: [...smali_root_dirs],
    dirs:      []
  }

  for (let i=0; i < smali_root_dirs.length; i++) {
    const smali_root_dir = smali_root_dirs[i]
    await process_smali_dir(smali_root_dir, smali_root_dir, smali_dirs_data)
  }

  return(smali_dirs_data)
}

// -----------------------------------------------------------------------------

module.exports = get_mappings
