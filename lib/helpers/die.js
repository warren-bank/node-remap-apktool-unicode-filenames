const die = (msg, isSuccess) => {
  const prefix   = isSuccess ? '[success] ' : '[error] '
  const exitcode = isSuccess ? 0 : 1

  console.log(prefix + msg)
  process.exit(exitcode)
}

module.exports = die
