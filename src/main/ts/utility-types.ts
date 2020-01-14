export interface IConstructable<T = {}> extends Function {
  new (...args: any[]): T
}

export type InstanceTypeOrType<T> = T extends IConstructable
  ? InstanceType<T>
  : T

export type ConstuctableOrEmpty<T> = T extends IConstructable
  ? T
  : {}

export type UnionToIntersectionOfConstructable<U> = (U extends any
  ? (k: ConstuctableOrEmpty<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

export type UnionToIntersectionOfNonConstructable<U> = (U extends any
  ? (k: InstanceTypeOrType<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

// https://github.com/microsoft/TypeScript/issues/17572
export type Abstract<T= {}> = Function & {prototype: T}
export type Constructor<T= {}> = new (...args: any[]) => T
export type Class<T= {}> = Abstract<T> & Constructor<T>
