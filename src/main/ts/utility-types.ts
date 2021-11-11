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

type UnionToIntersectionHelper<U, K extends boolean = false> = (U extends any
  ? (k: Extends<K, true, InstanceTypeOrType<U>, ConstructableOrEmpty<U>>) => void
  : never) extends (k: infer I) => void
  ? I
  : never

export type UnionToIntersectionOfInstances<U> = UnionToIntersectionHelper<U, true>

export type UnionToIntersectionOfConstructables<U> = UnionToIntersectionHelper<U>

export type UnaryOrIntersectionTypeFactory<T> = Extends<T, UnaryFn, T, <V>(v: V) => V & T>
