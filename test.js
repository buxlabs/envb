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

    context('when an environment variable is not defined', function () {
      it('returns undefined', function () {
        assert.deepEqual(env.get('UNDEFINED_ENVIRONMENT_VARIABLE'), undefined)
      })
    })
  })

  describe('#fetch', function () {
    context('when an environment variable is present', function () {
      it('returns it', function () {
        assert(env.fetch('PATH'))
      })
    })

    context('when an environment variable is not defined', function () {
      it('throws an exception', function () {
        let raised = false
        try {
          env.fetch('UNDEFINED_ENVIRONMENT_VARIABLE')
        } catch (exception) {
          raised = true
        }
        assert(raised)
      })
    })
  })
  describe('#load', function () {
    context('when .env.example file is not present', function () {
      it('throws an exception', function () {
        let raised = false
        try {
          env.load({ location: temp })
        } catch (exception) {
          raised = true
        }
        assert(raised)
      })
    })

    context('when .env file is not present', function () {
      it('throws an exception', function () {
        const file = join(temp, '.env.example')
        writeFileSync(file, 'HELLO=world')
        let raised = false
        try {
          env.load({ location: temp })
        } catch (exception) {
          raised = true
        }
        assert(raised)
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
          env.load({ location: temp })
          unlinkSync(file1)
          unlinkSync(file2)
          assert(env.get('HELLO') === 'world')
        })
      })
    })
  })
})
