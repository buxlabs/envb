const assert = require('assert')
const { writeFileSync, unlinkSync } = require('fs')
const { join } = require('path')
const env = require('.')
const { tmpdir } = require('os')
const temp = tmpdir()

function describe (description, callback) { callback() }
function context (description, callback) { callback() }
function it (description, callback) { callback() }

describe('envb', function () {
  describe('#get', function () {
    context('when an environment variable is present', function () {
      it('returns it', function () {
        assert(env.get('PATH'))
      })
    })

    context('when a variable is present in the .env file', function () {
      it('returns it', function () {
        assert(env.get('TEST_1'))
      })
    })

    context('when an environment variable is not defined', function () {
      it('returns undefined', function () {
        assert.deepEqual(env.get('UNDEFINED_ENVIRONMENT_VARIABLE'), undefined)
      })
    })

    context('when fetch is called with an array of strings', function () {
      it('returns many results', function () {
        assert.deepEqual(env.get(['PATH', 'TEST_1']), [process.env.PATH, 'true'])
      })

      context('when any of the keys is not defined', function () {
        it('returns undefined for that key', function () {
          assert.deepEqual(env.get(['PATH', 'UNDEFINED_ENVIRONMENT_VARIABLE']), [process.env.PATH, undefined])
        })
      })
    })
  })

  describe('#fetch', function () {
    context('when an environment variable is present', function () {
      it('returns it', function () {
        assert(env.fetch('PATH'))
      })
    })

    context('when a variable is present in the .env file', function () {
      it('returns it', function () {
        assert(env.fetch('TEST_1'))
      })
    })

    context('when an environment variable is not defined', function () {
      it('throws an error', function () {
        let exception = null
        try {
          env.fetch('UNDEFINED_ENVIRONMENT_VARIABLE')
        } catch (error) {
          exception = error
        }
        assert(exception)
      })
    })

    context('when fetch is called with an array of strings', function () {
      it('returns many results', function () {
        assert.deepEqual(env.fetch(['PATH', 'TEST_1']), [process.env.PATH, 'true'])
      })

      context('when any of the keys is not defined', function () {
        it('throws an error', function () {
          let exception = null
          try {
            env.fetch(['PATH', 'UNDEFINED_ENVIRONMENT_VARIABLE'])
          } catch (error) {
            exception = error
          }
          assert(exception)
        })
      })
    })
  })
  describe('#load', function () {
    context('when .env.example file is not present', function () {
      it('throws an error', function () {
        let exception = null
        try {
          env.load({ path: temp })
        } catch (error) {
          exception = error
        }
        assert(exception)
        assert(exception.message.includes(".env.example file is missing"))
      })
    })

    context('when .env file is not present', function () {
      it('throws an error', function () {
        const file = join(temp, '.env.example')
        writeFileSync(file, 'HELLO=world')
        let exception = null
        try {
          env.load({ path: temp })
        } catch (error) {
          exception = error
        }
        assert(exception)
        assert(exception.message.includes(".env file is missing"))
        unlinkSync(file)
      })
    })
    context('when .env.example and .env are present', function () {
      context('when .env is not empty', function () {
        it('assigns the values from the .env file', function () {
          const file1 = join(temp, '.env.example')
          const file2 = join(temp, '.env')
          writeFileSync(file1, 'HELLO=world')
          writeFileSync(file2, 'HELLO=world')
          env.load({ path: temp })
          unlinkSync(file1)
          unlinkSync(file2)
          assert(env.get('HELLO') === 'world')
        })
      })
    })
  })
})
