import {
  applyMixinsAsProxy,
  applyMixinsAsMerge,
  applyMixinsAsSubclass
} from '../../main/ts/mixer'

describe('applyMixins', () => {
  interface A {
    a(): string
  }
  interface B extends A {
    b(): string
  }
  interface C extends B {
    c(): string
  }
  interface D {
    d(): number
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

  class ACtor implements A {
    a() {
      return 'a'
    }
    static foo() {return 'foo'}
  }
  class BCtor extends ACtor implements B {
    b() {
      return this.a().toUpperCase()
    }
    static bar() {return 'bar'}
  }
  class DCtor implements D {
    d() {
      return 1
    }
  }

  describe('applyMixinsAsProxy', () => {
    it('attaches mixins as a proxy', () => {
      type ITarget = {foo: string}
      const t: ITarget = {foo: 'bar'}
      const t2 = applyMixinsAsProxy(t, a, b, c)

      expect(t2.c()).toBe('aA')
      expect(t2.a()).toBe('a')
      expect(t2.foo).toBe('bar')
      // @ts-ignore
      expect(t2.d).toBeUndefined()
    })
  })

  describe('applyMixinsAsMerge', () => {
    it('attaches mixins through object assignment', () => {
      type ITarget = {foo: string}
      const t: ITarget = {foo: 'bar'}
      const t2 = applyMixinsAsMerge(t, a, b, c)

      expect(t).toBe(t2)
      expect(t2.c()).toBe('aA')
      expect(t2.a()).toBe('a')
      expect(t2.foo).toBe('bar')
      // @ts-ignore
      expect(t2.d).toBeUndefined()
    })
  })

  describe('applyMixinsAsSubclass', () => {
    it('merges several classes into a one subclass', () => {
      const M = applyMixinsAsSubclass(ACtor, BCtor, DCtor)
      const m = new M()

      expect(M.foo()).toBe('foo')
      expect(M.bar()).toBe('bar')

      expect(m).toBeInstanceOf(M)
      expect(m).toBeInstanceOf(ACtor)
      expect(m.a()).toBe('a')
      expect(m.b()).toBe('A')
      expect(m.d()).toBe(1)

      // @ts-ignore
      expect(m.c).toBeUndefined()
    })
  })
})
