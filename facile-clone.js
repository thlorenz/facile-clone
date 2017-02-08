const DELETED = '<deleted>'

const xtend = require('xtend')
const defaultOpts = {
    bufferLength: 0
  , stringLength: 0
}

function getPrototypeName(obj) {
  if (typeof obj !== 'object' || obj === null) return null
  const proto = Object.getPrototypeOf(obj)
  if (proto == null) return null
  if (proto.constructor == null) return null
  return proto.constructor.name
}

function clipBuffer(buf, bufferLen) {
  const len = buf.length
  if (bufferLen === 0) {
    return {
        type: 'Buffer'
      , len: len
      , included: 0
      , val: DELETED
    }
  }
  const include = Math.min(bufferLen, len)
  const val = new Buffer(include)
  buf.copy(val, 0, 0, include)
  return {
      type: 'Buffer'
    , len: len
    , included: include
    , val: val
  }
}

function clipString(s, stringLen) {
  const len = s.length
  if (stringLen === 0) {
    return {
        type: 'string'
      , len: len
      , included: 0
      , val: DELETED
    }
  }

  const include = Math.min(stringLen, len)
  const val = s.slice(0, include)
  return {
      type: 'string'
    , len: len
    , included: include
    , val: val
  }
}

/**
 * Creates a shallow clone of the object, focusing on primitives and omitting
 * or clipping large values.
 *
 * For objects it also attempts to detect their prototype and provides it via the `proto`
 * property.
 *
 * @name facileClone
 * @function
 * @param {Object} x the object to clone
 * @param {Object} opts options to configure how large values are omitted/clipped
 * @param {Number=} opts.bufferLength if greater than `0` parts of buffers are included in the clone, default: `0`
 * @param {Number=} opts.stringLength if greater than `0` parts of strings are included in the clone, default: `0`
 */
module.exports = function facileClone(x, opts) {
  opts = xtend(defaultOpts, opts)
  const bufferLen = opts.bufferLength
  const stringLen = opts.stringLength

  function processKey(acc, k) {
    const val = x[k]
    // The only "real" primitivies (Number and Boolean) and
    // `null` + `undefined` go right through
    if (typeof val === 'number' ||
        typeof val === 'boolean' ||
        val == null) {
      acc[k] = val
      return acc
    }

    if (typeof val === 'string') {
      acc[k] = clipString(val, stringLen)
      return acc
    }

    if (Buffer.isBuffer(val)) {
      acc[k] = clipBuffer(val, bufferLen)
      return acc
    }

    // all other types we just replace with a type indicator
    acc[k] = { type: typeof val, proto: getPrototypeName(val), val: DELETED }
    return acc
  }

  return Object.keys(x).reduce(processKey, {})
}
