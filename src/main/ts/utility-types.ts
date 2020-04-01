import {IConstructable, Extends, UnaryFn, PrependTuple} from '@qiwi/substrate'

export {
  UnaryFn as Unary,
  PrependTuple,
  Extends,
}

export type InstanceTypeOrType<T> = Extends<T, IConstructable, InstanceType<IConstructable & T>, T>

export type ConstuctableOrEmpty<T> = Extends<T, IConstructable, T, {}>

export type UnionToIntersectionOfConstructables<U> = (U extends any
  ? (k: ConstuctableOrEmpty<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

export type UnionToIntersectionOfInstances<U> = (U extends any
  ? (k: InstanceTypeOrType<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

export type UnaryOrIntersectionTypeFactory<T> = Extends<T, UnaryFn, T, <V>(v: V) => V & T>
