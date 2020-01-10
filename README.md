# mixin
Self-education project to compare different mixin approaches in TypeScript

## Questions
1. Is it possible to mix classes with automated type inference?
2. How to combine OOP and functional mixins?
3. How to check if composition has a given mixin or not?
4. What's about mixin factories?

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

2. Prototype modification
    ```typescript
    class Derived {}
    class Mixed {
      foo() { return 'bar' }
    }
    
    Object.getOwnPropertyNames(Mixed.prototype).forEach(name => {
        Object.defineProperty(Derived.prototype, name, Object.getOwnPropertyDescriptor(Mixed.prototype, name));
    })
    ```

3. Object modification
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

## ApplyMixins

 
Official TS documentation gives [the following mixin implementation](https://www.typescriptlang.org/docs/handbook/mixins.html)
```typescript
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
```



## Refs
* [https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c](https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c)
* [https://mariusschulz.com/blog/mixin-classes-in-typescript](https://mariusschulz.com/blog/mixin-classes-in-typescript)
* [https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
* [https://github.com/justinfagnani/mixwith.js](https://github.com/justinfagnani/mixwith.js)
* [https://github.com/amercier/es6-mixin](https://github.com/amercier/es6-mixin)
* [https://stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful](https://stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful)
