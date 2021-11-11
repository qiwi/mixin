const assert = require('assert')
const {applyMixins} = require('@qiwi/mixin/umd')

function A() {
}
A.prototype.a = function () {
  return 'a'
}
var b = {
  b: function() {
    return 'b'
  },
}

const c = applyMixins({}, A, b)
assert(c.a() === 'a')
assert(c.b() === 'b')

const D = applyMixins(A, b)
const d = new D()

assert(d.a() === 'a')
assert(d.b() === 'b')