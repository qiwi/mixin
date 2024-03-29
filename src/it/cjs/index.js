var assert = require('assert')
var {applyMixins} = require('@qiwi/mixin/cjs')
// or require('@qiwi/mixin/cjs')

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

var c = applyMixins({}, A, b)
assert(c.a() === 'a')
assert(c.b() === 'b')

var D = applyMixins(A, b)
var d = new D()

assert(d.a() === 'a')
assert(d.b() === 'b')