const facileClone = require('./')

const o = {
    num: 1
  , bool: true
  , string: '0123456789'
  , buf: Buffer.from('0123456789')
  , null: null
  , undefined: undefined
  , object: { foo: 'bar' }
}

console.log(facileClone(o))
/*  =>  { num: 1,
          bool: true,
          string: { type: 'string', len: 10, included: 0, val: '<deleted>' },
          buf: { type: 'Buffer', len: 10, included: 0, val: '<deleted>' },
          null: null,
          undefined: undefined,
          object: { type: 'object', val: '<deleted>' } } */

const bufObject = {
  buf: Buffer.from('0123456789')
}
console.log(facileClone(bufObject, { bufferLength: 5 }))
// => { buf: { type: 'Buffer', len: 10, included: 5, val: <Buffer 30 31 32 33 34> } }

const stringObject = {
  string: '0123456789'
}
console.log(facileClone(stringObject, { stringLength: 5 }))
// => { string: { type: 'string', len: 10, included: 5, val: '01234' } }
