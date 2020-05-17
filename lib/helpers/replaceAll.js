// -------------------------------------------------------------------
// input:  {subject, search, replace} = args
// output: undefined
// note:   args.subject is passed by reference, and is updated inplace
//         args.counter is the number of replacements that occurred in subject
// -------------------------------------------------------------------

const replaceAll = (args) => {
  const {search, replace} = args

  if (typeof args.subject !== 'string')
    return
  if (typeof search !== 'string')
    return
  if (typeof replace !== 'string')
    return
  if (!args.subject)
    return
  if (!search)
    return
  if (search === replace)
    return

  const search_length = search.length
  let   search_index  = args.subject.indexOf(search)

  while (search_index !== -1) {
    args.subject = args.subject.substring(0, search_index) + replace + args.subject.substring(search_index + search_length)
    args.counter = (args.counter ? args.counter : 0) + 1
    search_index = args.subject.indexOf(search)
  }
}

module.exports = replaceAll
