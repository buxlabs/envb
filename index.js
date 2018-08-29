const { readFileSync } = require('fs')
const { join } = require('path')
const { assign } = Object
const KEY_VALUE_REGEXP = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const NEWLINE = '\n'

function parse (string) {
  const object = {}

  string.split(NEWLINE).forEach(function (line) {
    const array = line.match(KEY_VALUE_REGEXP)
    if (array != null) {
      const key = array[1]
      let value = array[2] || ''
      const length = value ? value.length : 0
      if (length > 0 && value.charAt(0) === '"' && value.charAt(length - 1) === '"') {
        value = value.replace(/\\n/gm, NEWLINE)
      }
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      object[key] = value
    }
  })

  return object
}

class Environment {
  constructor () {
    this.env = assign({}, process.env)
  }
  get (key) {
    return this.env[key]
  }
  fetch (key) {
    const value = this.env[key]
    if (!value) { throw `Environment variable ${key} is empty.` }
    return this.env[key]
  }
  load (options = {}) {
    const example = parse(readFileSync(join(options.location || process.cwd(), '.env.example'), 'utf8'))
    const env = parse(readFileSync(join(options.location || process.cwd(), '.env'), 'utf8'))
    const missing = []
    for (let key in example) {
      if (!env[key]) {
        missing.push(key)
      }
    }
    if (missing.length > 0) {
      throw new Error(`Missing variables in .env file: ${missing.join(', ')}`)
    }
    this.env = assign(this.env, env)
    return this.env
  }
}

module.exports = new Environment()
