import {applyMixinAsProxy, mixAsProxy} from '../../main/ts'

describe('mixin', () => {
  interface A {
    a(): string
  }
  interface B extends A {
    b(): string
  }

  interface C extends B {
    c(): string
  }
  const a: A = {
    a() {
      return 'a'
    },
  }
  const b = {
    b() {
      return this.a().toUpperCase()
    },
  } as B

  const c = {
    c() {
      return this.a() + this.b()
    },
  } as C

  /*  describe('applyMixinsAsProxy', () => {
      it('attaches mixins as a proxies', () => {
        const target = {}
        const mixed = applyMixinAsProxy(target, aMixin, bMixin, cMixin)

        expect(mixed.a).not.toBeUndefined()
        expect(mixed.d).toBeUndefined()
      })
    })*/

  describe('mixAsProxy', () => {
    it('attaches mixins as a proxies', () => {
      const withAMixin = <T>(t: T): T & A => mixAsProxy<T, A>(t, a)
      const withBMixin = <T>(t: T): T & B => mixAsProxy<T, B>(t, b)
      const withCMixin = <T>(t: T): T & C => mixAsProxy<T, C>(t, c)

      type ITarget = {foo: string}
      const t: ITarget = {foo: 'bar'}
      // const t1 = mixAsProxy<typeof t, IAMixin>(t, aMixin)
      // const t2 = mixAsProxy<typeof t1, IBMixin>(t1, bMixin)

      const t2 = withCMixin(withBMixin(withAMixin(t)))

      expect(t2.c()).toBe('aA')
      expect(t2.a()).toBe('a')
      expect(t2.foo).toBe('bar')
      // @ts-ignore
      expect(t2.baz).toBeUndefined()

      const t3 = applyMixinAsProxy(t, a, b, c)

      // @ts-ignore
      expect(t3.d).toBeUndefined()
    })
  })
})
