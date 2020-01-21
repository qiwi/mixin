# @qiwi/mixin
RnD project to compare different mixin approaches in TypeScript.

## Usage
```typescript
import {applyMixins} from '@qiwi/mixin'

interface IA {
  a: () => string
}
interface IB {
  b: () => string
}
class A implements IA {
  a() { return 'a' }
}
const b: IB = {
  b() { return 'b' }
}

const c = applyMixins({}, A, b)
c.a() // 'a'
c.b() // 'b'

const D = applyMixins(A, b)
const d = new D()

d.a() // 'a'
d.b() // 'b'
```

## Questions
0. Definition.
    > A mixin is a special kind of multiple inheritance.
1. Is it possible to mix classes with automated type inference?
    > There're several solutions:
    > * A subclass factory 
    > * Proto merge + constructor invocation + type cast workarounds
2. How to combine OOP and functional mixins?
    > Apply diff merge strategies for each mixin type
3. How to check if composition has a given mixin or not?
    > Ref Cache / WeakMap
4. What's about mixin factories?  
    > It's called `applyMixins`

## Definition
A mixin is a special kind of multiple inheritance. It's a form of object composition, where component features get mixed into a composite object so that properties of each mixin become properties of the composite object.
  
In OOP, a mixin is a class that contains methods for use by other classes, and can also be viewed as an interface with implemented methods.  

Functional mixins are composable factories which connect together in a pipeline; each function adding some properties or behaviors.

Perhaps these are not perfect definitions, but we'll rely on them.

## How to and what to mix
1. Subclass factory
    ```typescript
    type Constructor<T = {}> = new (...args: any[]) => T
    
    function MixFoo<TBase extends Constructor>(Base: TBase) {
      return class extends Base {
        foo() { return 'bar' }
      }
    }
    ```

2. Prototype injection
    ```typescript
    class Derived {}
    class Mixed {
      foo() { return 'bar' }
    }
    
    Object.getOwnPropertyNames(Mixed.prototype).forEach(name => {
        Object.defineProperty(Derived.prototype, name, Object.getOwnPropertyDescriptor(Mixed.prototype, name));
    })
    ```

3. Object assignment
    ```typescript
    const foo = {foo: 'foo'}
    const fooMixin = (target) => Object.assign(target, foo)
    const bar = fooMixin({bar: 'bar'})
    ```

4. Proxy wrapping
    ```typescript
    const mixAsProxy = <P extends IAnyMap, M extends IAnyMap>(target: P, mixin: M): P & M => new Proxy(target, {
      get: (obj, prop: string) => {
        return prop in mixin
          // @ts-ignore
          ? mixin[prop]
          // @ts-ignore
          : obj[prop]
      },
    }) as P & M
    ```

## Refs
* [https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c](https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c)
* [https://mariusschulz.com/blog/mixin-classes-in-typescript](https://mariusschulz.com/blog/mixin-classes-in-typescript)
* [https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
* [https://github.com/justinfagnani/mixwith.js](https://github.com/justinfagnani/mixwith.js)
* [https://github.com/amercier/es6-mixin](https://github.com/amercier/es6-mixin)
* [https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/](https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/)
* [https://stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful](https://stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful)
* [https://stackoverflow.com/questions/48372465/type-safe-mixin-decorator-in-typescript](https://stackoverflow.com/questions/48372465/type-safe-mixin-decorator-in-typescript)
* [https://stackoverflow.com/questions/13407036/how-does-interfaces-with-construct-signatures-work](https://stackoverflow.com/questions/13407036/how-does-interfaces-with-construct-signatures-work)
