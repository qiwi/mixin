import {applyMixinAsProxy, mixAsProxy} from '../../main/ts'

describe('mixin', () => {
  interface IAMixin {
    a(): string
  }
  interface IBMixin extends IAMixin {
    b(): string
  }

  interface ICMixin extends IBMixin {
    c(): string
  }
  const aMixin: IAMixin = {
    a() {
      return 'a'
    },
  }
  const bMixin = {
    b() {
      return this.a().toUpperCase()
    },
  } as IBMixin

  const cMixin = {
    c() {
      return this.a() + this.b()
    },
  } as ICMixin

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
      const withAMixin = <T>(t: T): T & IAMixin => mixAsProxy<T, IAMixin>(t, aMixin)
      const withBMixin = <T>(t: T): T & IBMixin => mixAsProxy<T, IBMixin>(t, bMixin)
      const withCMixin = <T>(t: T): T & ICMixin => mixAsProxy<T, ICMixin>(t, cMixin)

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

      const t3 = applyMixinAsProxy(t, aMixin, bMixin, cMixin)

      // @ts-ignore
      expect(t3.d).toBeUndefined()
    })
  })
})
