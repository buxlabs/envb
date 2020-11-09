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

function read (path) {
  try {
    return parse(readFileSync(path, 'utf8'))
  } catch (exception) {
    if (exception.code === 'ENOENT') {
      if (path.endsWith('.env')) {
        throw new Error(`[envb] .env file is missing at path ${path}`, exception)
      } else if (path.endsWith('.env.example')) {
        throw new Error(`[envb] .env.example file is missing at path ${path}`, exception)
      }

    }
    throw exception
  }
}

class Environment {
  constructor () {
    this.env = assign({}, process.env)
    this.loaded = false
  }
  get (key) {
    if (!this.loaded) { this.load() }
    if (Array.isArray(key)) {
      return key.map(id => this.env[id])
    }
    return this.env[key]
  }
  fetch (key) {
    if (!this.loaded) { this.load() }
    if (Array.isArray(key)) {
      return key.map(id => {
        const value = this.env[id]
        if (!value) { throw `Environment variable ${key} is empty.` }
        return value
      })
    }
    const value = this.env[key]
    if (!value) { throw `Environment variable ${key} is empty.` }
    return this.env[key]
  }
  load (options = {}) {
    const path = options.path || process.cwd()
    const example = read(join(path, '.env.example'))
    const env = read(join(path, '.env'))
    this.env = assign(this.env, env)
    this.loaded = true
    return this.env
  }
}

module.exports = new Environment()
