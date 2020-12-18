import {
  Extends,
  IConstructable,
  PrependTuple,
  UnaryFn,
} from '@qiwi/substrate'

export {
  UnaryFn as Unary,
  PrependTuple,
  Extends,
}

export type InstanceTypeOrType<T> = Extends<T, IConstructable, InstanceType<IConstructable & T>, T>

export type ConstructableOrEmpty<T> = Extends<T, IConstructable, T, Record<any, any>>

export type UnionToIntersectionOfConstructables<U> = (U extends any
  ? (k: ConstructableOrEmpty<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

export type UnionToIntersectionOfInstances<U> = (U extends any
  ? (k: InstanceTypeOrType<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

export type UnaryOrIntersectionTypeFactory<T> = Extends<T, UnaryFn, T, <V>(v: V) => V & T>
