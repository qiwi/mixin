# @qiwi/mixin
RnD project to compare various mixin approaches in TypeScript.

[![CI](https://github.com/qiwi/mixin/actions/workflows/ci.yaml/badge.svg)](https://github.com/qiwi/mixin/actions/workflows/ci.yaml)
[![Maintainability](https://api.codeclimate.com/v1/badges/0ff60f82e170ad04b600/maintainability)](https://codeclimate.com/github/qiwi/mixin/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0ff60f82e170ad04b600/test_coverage)](https://codeclimate.com/github/qiwi/mixin/test_coverage)
[![npm (tag)](https://img.shields.io/npm/v/@qiwi/mixin)](https://www.npmjs.com/package/@qiwi/mixin)

- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Install](#install) 
  - [Usage](#usage) 
  - [Exports](#exports) 
  - [Advanced examples](#advanced-examples)
    - [`applyMixinsAsProxy`](#applymixinsasproxy) 
    - [`applyMixinsAsMerge`](#applymixinsasmerge) 
    - [`applyMixinsAsSubclass`](#applymixinsassubclass) 
    - [`applyMixinsAsProto`](#applymixinsasproto) 
    - [`applyMixinsAsFactory`](#applymixinsasfactory) 
- [Implementation notes](#implementation-notes)
  - [Q&A](#qa)
  - [Definition](#definition)
  - [Mixin cases](#mixin-cases)
- [Refs](#refs)
- [Alternatives](#alternatives)
- [License](#license)

## Getting started

### Requirements
Node.js `^12.20.0 || ^14.13.1 || >=16.0.0`

### Install
```shell
yarn add @qiwi/mixin
npm i @qiwi/mixin
```

### Usage
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

### Exports
The library exposes itself as `cjs`, `esm`, `umd` and `ts` sources.
Follow `packages.json test:it:*` scripts and [integration tests examples](https://github.com/qiwi/mixin/tree/master/src/it) if you're having troubles with loading.

### Advanced examples
```typescript
import {
  applyMixinsAsProxy,
  applyMixinsAsMerge,
  applyMixinsAsSubclass,
  applyMixinsAsProto,
  applyMixinsAsPipe
} from '@qiwi/mixin'

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
```

#### applyMixinsAsProxy
```typescript
  type ITarget = { foo: string }
  const t: ITarget = {foo: 'bar'}
  const t2 = applyMixinsAsProxy(t, a, b, c, _a)

  t2.c()  // '_a_A'
  t2.a()  // '_a'
  t2.foo  // 'bar'
  // @ts-ignore
  t2.d    // undefined
```

#### applyMixinsAsMerge
```typescript
  type ITarget = { foo: string }
  const t: ITarget = {foo: 'bar'}
  const t2 = applyMixinsAsMerge(t, a, b, c)

  t === t2  // true
  t2.c()    // 'aA'
  t2.a()    // 'a'
  t2.foo    // 'bar'
```

#### applyMixinsAsSubclass
```typescript
  const M = applyMixinsAsSubclass(ACtor, Blank, BCtor, DCtor)
  const m = new M()

  M.foo()   // 'foo'
  M.bar()   // 'bar'

  m instanceof M // true
  m instanceof ACtor // true
  m.a()     // 'a'
  m.b()     // 'A'
  m.d()     // 1
```

#### applyMixinsAsProto
```typescript
  class Target {
    method() {
      return 'value'
    }
  }
  const Derived = applyMixinsAsProto(Target, ACtor, BCtor, DCtor, Blank)
  const m = new Derived()

  Derived === Target // true
  Derived.foo() // 'foo'
  Derived.bar() // 'bar'

  m.a()   // 'a'
  m.b()   // 'A'
  m.d()   // 1
```

#### applyMixinsAsFactory
```typescript
  const n = (n: number) => ({n})
  const m = ({n}: {n: number}) => ({n: 2 * n})
  const k = ({n}: {n: string}) => n.toUpperCase()
  const e = <T extends {}>(e: T): T & {foo: string} => ({...e, foo: 'foo'})
  const i = <T extends {foo: number}>(i: T): T => i

  const nm = applyMixinsAsPipe(n, m)
  const ie = applyMixinsAsPipe(i, e)

  const v1: number = nm(2).n          // 4
  const v2: string = ie({foo: 1}).foo // 'foo'
```

## Implementation notes
### Q&A
0. Definition.
    > A mixin is a special kind of multiple inheritance.
1. Is it possible to mix classes with automated type inference?
    > There're several solutions:
    > * A subclass factory 
    > * Proto merge + constructor invocation + type cast workarounds
2. How to combine OOP and functional mixins?
    > Apply different merge strategies for each target type and rest args converters
3. How to check if composition has a given mixin or not?
    > Ref Cache / WeakMap
4. What's about mixin factories?  
    > It's called `applyMixins`

### Definition
A mixin is a special kind of multiple inheritance. It's a form of object composition, where component features get mixed into a composite object so that properties of each mixin become properties of the composite object.
  
In OOP, a mixin is a class that contains methods for use by other classes, and can also be viewed as an interface with implemented methods.  

Functional mixins are composable factories which connect together in a pipeline; each function adding some properties or behaviors.

Perhaps these are not perfect definitions, but we'll rely on them.

### Mixin cases
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
5. Functional mixin piping
    ```typescript
    const foo = <T>(t: T): T & {foo: string} => ({...t, foo: 'foo'})
    const bar = <T>(t: T): T & {bar: number} => ({...t, bar: 1})
    const foobar = pipe(foo, bar) // smth, that composes fn mixins like `(target) => bar(foo(target))`
    const target = {}
    
    const res = foobar(target)
    ```

## Refs
* [medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c](https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c)
* [medium.com/ackee/typescript-function-composition-and-recurrent-types-a9efbc8e7736](https://medium.com/ackee/typescript-function-composition-and-recurrent-types-a9efbc8e7736)
* [medium.com/@michaelolof/typescript-mix-yet-another-mixin-library-29c7a349b47d](https://medium.com/@michaelolof/typescript-mix-yet-another-mixin-library-29c7a349b47d)
* [dev.to/miracleblue/how-2-typescript-get-the-last-item-type-from-a-tuple-of-types-3fh3](https://dev.to/miracleblue/how-2-typescript-get-the-last-item-type-from-a-tuple-of-types-3fh3)
* [dev.to/ascorbic/creating-a-typed-compose-function-in-typescript-3-351i](https://dev.to/ascorbic/creating-a-typed-compose-function-in-typescript-3-351i)
* [mariusschulz.com/blog/mixin-classes-in-typescript](https://mariusschulz.com/blog/mixin-classes-in-typescript)
* [justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
* [github.com/justinfagnani/mixwith.js](https://github.com/justinfagnani/mixwith.js)
* [github.com/amercier/es6-mixin](https://github.com/amercier/es6-mixin)
* [github.com/Kotarski/ts-functionaltypes](https://github.com/Kotarski/ts-functionaltypes)
* [www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/](https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/)
* [stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful](https://stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful)
* [stackoverflow.com/questions/48372465/type-safe-mixin-decorator-in-typescript](https://stackoverflow.com/questions/48372465/type-safe-mixin-decorator-in-typescript)
* [stackoverflow.com/questions/13407036/how-does-interfaces-with-construct-signatures-work](https://stackoverflow.com/questions/13407036/how-does-interfaces-with-construct-signatures-work)

## Alternatives
* https://github.com/tannerntannern/ts-mixer
* https://github.com/michaelolof/typescript-mix

## License
[MIT](./LICENSE)
