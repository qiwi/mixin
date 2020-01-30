import {IConstructable} from '@qiwi/substrate'

export type IExtendsCondition<T, E, R1, R2> = T extends E
  ? R1
  : R2

export type InstanceTypeOrType<T> = IExtendsCondition<T, IConstructable, InstanceType<IConstructable & T>, T>

export type ConstuctableOrEmpty<T> = IExtendsCondition<T, IConstructable, T, {}>

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
