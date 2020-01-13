import {
  toClassMixin,
  toObjectMixin,
  isClass
} from '../../main/ts/util'

describe('util', () => {
  describe('isClass', () => {
    it('detects ES6 class', () => {
      class Foo {}

      expect(isClass(Foo)).toBeTruthy()
    })

    it('detects ES5 class (as much as possible)', () => {
      function Foo() { /* noop */ }
      Foo.prototype = {
        foo() { return 'foo' }
      }

      expect(isClass(Foo)).toBeTruthy()
    })

    it('returns false otherwise', () => {
      function Foo() { /* noop */ }

      expect(isClass(Foo)).toBeFalsy()
    })
  })

  describe('toClassMixin', () => {
    it('creates class based on object', () => {
      const foo = {foo() { return 'foo' }}
      const Foo = toClassMixin(foo)
      const _foo= new Foo()

      expect(_foo.foo()).toBe('foo')

      // @ts-ignore
      expect(_foo.bar).toBeUndefined()
    })

    it('returns class argument as is', () => {
      class Foo {
        foo() { return 'foo' }
      }
      const foo= new Foo()

      expect(toClassMixin(Foo)).toBe(Foo)
      expect(foo.foo()).toBe('foo')
      // @ts-ignore
      expect(foo.bar).toBeUndefined()
    })
  })

  describe('toObjectMixin', () => {
    it('represents class as object', () => {
      class Foo {
        foo() { return 'foo' }
      }
      const foo = toObjectMixin(Foo)

      expect(foo.foo()).toBe('foo')
      // @ts-ignore
      expect(foo.bar).toBeUndefined()
    })

    it('returns object-like argument as is', () => {
      const foo = {foo() { return 'foo' }}
      const _foo = toObjectMixin(foo)

      expect(_foo).toBe(foo)
      expect(_foo.foo()).toBe('foo')
      // @ts-ignore
      expect(_foo.bar).toBeUndefined()
    })
  })
})
