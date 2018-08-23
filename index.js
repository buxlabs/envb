const { readFileSync } = require('fs')
const { join } = require('path')
const { assign } = Object

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
  load () {
    const example = readFileSync(join(__dirname, '.env.example'), 'utf8')
    const env = readFileSync(join(__dirname, '.env'), 'utf8')
    this.env = assign({}, process.env, env)
    return this.env
  }
}

module.exports = new Environment()
