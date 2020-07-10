## Advanced usage
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

### applyMixinsAsProxy
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

### applyMixinsAsMerge
```typescript
  type ITarget = { foo: string }
  const t: ITarget = {foo: 'bar'}
  const t2 = applyMixinsAsMerge(t, a, b, c)

  t === t2  // true
  t2.c()    // 'aA'
  t2.a()    // 'a'
  t2.foo    // 'bar'
```

### applyMixinsAsSubclass
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

### applyMixinsAsProto
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

### applyMixinsAsFactory
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