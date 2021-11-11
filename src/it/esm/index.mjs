import assert from 'assert'
import {applyMixins} from '@qiwi/mixin'

class A {
  a() {
    return 'a'
  }
}
const b = {
  b() {
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