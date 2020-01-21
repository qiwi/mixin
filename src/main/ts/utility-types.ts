import {IConstructable} from '@qiwi/substrate'

export type InstanceTypeOrType<T> = T extends IConstructable
  ? InstanceType<T>
  : T

export type ConstuctableOrEmpty<T> = T extends IConstructable
  ? T
  : {}

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
