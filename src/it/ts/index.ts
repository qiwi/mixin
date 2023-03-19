import {applyMixins} from '@qiwi/mixin'
import assert from 'node:assert'

interface IA {
  a: () => string
}
interface IB {
  b: () => string
}
class A implements IA {
  a() {
    return 'a'
  }
}
const b: IB = {
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