const StringIdGenerator = require('../../../lib/helpers/StringIdGenerator')

const id_generator = new StringIdGenerator()
const count        = 52 * 52 * 3
const result       = []

for (let i=0; i<count; i++)
  result.push(id_generator.next())

console.log(result.join("|"))
