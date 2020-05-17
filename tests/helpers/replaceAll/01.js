const replaceAll = require('../../../lib/helpers/replaceAll')
const assert     = require('assert').strict

const count = 5

const args = {
  subject: ('foobar').repeat(count),
  search: 'bar',
  replace: 'baz'
}

replaceAll(args)

const chunks = args.subject.split(args.replace).filter(chunk => !!chunk)
assert(chunks.length === count)
