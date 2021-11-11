import { applyMixins } from '@qiwi/mixin'

describe('default lib entry', () => {
  it('works as in README example', () => {
    interface IA {
      a: () => string
    }
    interface IB {
      b: () => string
    }
    class A implements IA {

      constructor(param: number) {
        console.log(param)
      }

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
    expect(c.a()).toBe('a') // c.a() // 'a'
    expect(c.b()).toBe('b') // c.b() // 'b'

    const D = applyMixins(A, b)
    const d: InstanceType<typeof D> = new D(1)

    expect(d.a()).toBe('a') // d.a() // 'a'
    expect(d.b()).toBe('b') // d.b() // 'b'
  })
})
