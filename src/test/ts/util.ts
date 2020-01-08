import {isClass} from '../../main/ts/util'

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
})
