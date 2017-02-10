const fs = require('fs')
const test = require('tape')
const spok = require('spok')
// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')
const clone = require('../')
// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

// patch in Buffer.from for 0.10 to make tests pass
if (typeof Buffer.from !== 'function') {
  Buffer.from = function bufferFrom(s) { return new Buffer(s) }
}

const o = {
    num: 1
  , bool: true
  , string: 'Love trumps hate! At least you\'d hope ...'
  , buf: Buffer.from('Love trumps hate! At least you\'d hope ...')
  , null: null
  , undefined: undefined
  , object: { foo: 'bar' }
}

function isNull(x) {
  return x === null
}

function isUndefined(x) {
  return x === undefined
}

test('\ndefault opts', function(t) {
  const res = clone(o)

  spok(t, res,
    { num: 1
    , bool: true
    , null: isNull
    , undefined: isUndefined
  })

  spok(t, res.object,
    { $topic:'object', type: 'object', val: '<deleted>' })
  spok(t, res.string,
    { $topic: 'string',  type: 'string', len: 41, included: 0, val: '<deleted>' })
  spok(t, res.buf,
    { $topic: 'buffer', type: 'Buffer', len: 41, included: 0, val: '<deleted>' })

  t.end()
})

test('\ninclude up to 17 chars of buffer', function(t) {
  const res = clone(o, { bufferLength: 17 })

  spok(t, res,
    { num: 1
    , bool: true
    , null: isNull
    , undefined: isUndefined
  })

  spok(t, res.object,
    { $topic:'object', type: 'object', val: '<deleted>' })
  spok(t, res.string,
    { $topic: 'string',  type: 'string', len: 41, included: 0, val: '<deleted>' })

  spok(t, res.buf,
    { type: 'Buffer'
    , len: 41
    , included: 17
  })
  t.equal(res.buf.val.length, 17, 'included 17 chars of the buffer')
  t.equal(res.buf.val.toString(), 'Love trumps hate!', 'Love trumps hate!')
  t.end()
})

test('\ninclude up to 17 chars of string', function(t) {
  const res = clone(o, { stringLength: 17 })

  spok(t, res,
    { num: 1
    , bool: true
    , null: isNull
    , undefined: isUndefined
  })

  spok(t, res.object,
    { $topic:'object', type: 'object', val: '<deleted>' })
  spok(t, res.buf,
    { $topic: 'buffer', type: 'Buffer', len: 41, included: 0, val: '<deleted>' })
  spok(t, res.string,
    { type: 'string'
    , len: 41
    , included: 17
  })
  t.equal(res.string.val.length, 17, 'included 17 chars of the string')
  t.equal(res.string.val, 'Love trumps hate!', 'Love trumps hate!')
  t.end()
})

test('\ninclude 100 chars of buffer (longer than the original)', function(t) {
  const res = clone(o, { bufferLength: 100 })
  spok(t, res.buf,
    { type: 'Buffer'
    , len: 41
    , included: 41
  })
  t.equal(res.buf.val.length, 41, 'included 41 chars of the buf')
  t.equal(res.buf.val.toString(), 'Love trumps hate! At least you\'d hope ...', 'Love trumps hate! At least you\'d hope ...')
  t.end()
})

test('\ninclude 100 chars of string (longer than the original)', function(t) {
  const res = clone(o, { stringLength: 100 })
  spok(t, res.string,
    { type: 'string'
    , len: 41
    , included: 41
  })
  t.equal(res.string.val.length, 41, 'included 41 chars of the string')
  t.equal(res.string.val, 'Love trumps hate! At least you\'d hope ...', 'Love trumps hate! At least you\'d hope ...')
  t.end()
})

test('\nproto detection', function(t) {
  t.equal(clone({ stream: fs.createReadStream(__filename) }).stream.proto, 'ReadStream', 'detects ReadStream proto')
  t.equal(clone({ date: new Date() }).date.proto, 'Date', 'detects Date proto')
  t.equal(clone({ obj: {} }).obj.proto, 'Object', 'detects Object proto')
  t.equal(clone({ n: 1 }).n.proto, undefined, 'Number proto is undefined')
  t.equal(clone(fs.createReadStream(__filename)).proto, 'ReadStream', 'detects ReadStream proto on root')
  t.end()
})

test('\nfunction keeping', function(t) {
  function noop() {}
  let res = clone({ fn: noop })
  spok(t, res.fn,
    { $topic: 'fn deleted by default', type: 'function', proto: null, val: '<deleted>' })

  res = clone({ fn: noop }, { keepFunctions: true })
  t.strictEqual(res.fn, noop, 'attaches function to clone if keepFunctions is true')
  t.end()
})
