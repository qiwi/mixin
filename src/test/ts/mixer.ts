import {
  applyMixinsAsProxy,
  applyMixinsAsMerge,
  applyMixinsAsSubclass,
  applyMixinsAsProto,
  applyMixins,
} from '../../main/ts'

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
  const _a: A = {
    a() {
      return '_a'
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
    static foo() {
      return 'foo'
    }

  }

  class BCtor extends ACtor implements B {

    b() {
      return this.a().toUpperCase()
    }
    static bar() {
      return 'bar'
    }

  }

  class DCtor implements D {

    d() {
      return 1
    }

  }
  class Blank {}

  describe('applyMixinsAsProxy', () => {
    it('attaches mixins as a proxy', () => {
      type ITarget = { foo: string }
      const t: ITarget = {foo: 'bar'}
      const t2 = applyMixinsAsProxy(t, a, b, c, _a)

      expect(t2.c()).toBe('_a_A')
      expect(t2.a()).toBe('_a')
      expect(t2.foo).toBe('bar')
      // @ts-ignore
      expect(t2.d).toBeUndefined()
    })
  })

  describe('applyMixinsAsMerge', () => {
    it('attaches mixins through object assignment', () => {
      type ITarget = { foo: string }
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
      const M = applyMixinsAsSubclass(ACtor, Blank, BCtor, DCtor)
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

  describe('applyMixinsAsProto', () => {
    it('extends target class proto and statics with externals', () => {
      class Target {

        method() {
          return 'value'
        }

      }
      const Derived = applyMixinsAsProto(Target, ACtor, BCtor, DCtor, Blank)
      const m = new Derived()

      expect(Derived).toBe(Target)
      expect(Derived.foo()).toBe('foo')
      expect(Derived.bar()).toBe('bar')

      expect(m.a()).toBe('a')
      expect(m.b()).toBe('A')
      expect(m.d()).toBe(1)

      // @ts-ignore
      expect(m.c).toBeUndefined()
    })
  })

  describe('applyMixins', () => {
    it('if target has `class` type uses `applyMixinsAsSubclass` strategy', () => {
      const M = applyMixins(Blank, ACtor, BCtor, DCtor)
      const m = new M()

      expect(m).toBeInstanceOf(M)
      expect(m).toBeInstanceOf(Blank)
      expect(m.a()).toBe('a')
      expect(m.b()).toBe('A')
      expect(m.d()).toBe(1)

      // @ts-ignore
      expect(m.e).toBeUndefined()
    })

    it('if target is an object uses `applyMixinsAsMerge` strategy', () => {
      const m = applyMixins({}, a, b, c)

      expect(m.a()).toBe('a')
      expect(m.b()).toBe('A')
      expect(m.c()).toBe('aA')

      // @ts-ignore
      expect(m.d).toBeUndefined()
    })

    it('combines different types of arguments', () => {
      const foo = applyMixins({}, a, BCtor)
      const Bar = applyMixins(ACtor, DCtor, b)
      const bar = new Bar()

      expect(foo.a()).toBe('a')
      expect(foo.b()).toBe('A')
      // @ts-ignore
      expect(foo.d).toBeUndefined()

      expect(bar.a()).toBe('a')
      expect(bar.b()).toBe('A')
      expect(bar.d()).toBe(1)

      // @ts-ignore
      expect(foo.e).toBeUndefined()
    })

    it('looks to be composable', () => {
      const M = applyMixins(Blank, ACtor, applyMixins(BCtor, DCtor))
      const m = new M()

      expect(m).toBeInstanceOf(M)
      expect(m).toBeInstanceOf(Blank)
      expect(m.a()).toBe('a')
      expect(m.b()).toBe('A')
      expect(m.d()).toBe(1)

      // @ts-ignore
      expect(m.e).toBeUndefined()
    })

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
      c.a() // 'a'
      c.b() // 'b'

      const D = applyMixins(A, b)
      const d: InstanceType<typeof D> = new D(1)

      d.a() // 'a'
      d.b() // 'b'
    })
  })
})
