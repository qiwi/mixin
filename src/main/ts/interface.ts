/** @module @qiwi/mixin */
/** */

import {
  IAnyMap,
  IConstructable,
} from '@qiwi/substrate'

import {
  UnionToIntersectionOfConstructables,
  UnionToIntersectionOfInstances,
} from './utility-types'

export * from './pipe-types'
export * from './utility-types'

export type IMixedAsObject<T, U extends any[]> = T & UnionToIntersectionOfInstances<U[number]>

export type IMixedAsClass<T extends IConstructable, U extends any[]> = T
  & UnionToIntersectionOfConstructables<U[number]>
  & IConstructable<
    InstanceType<T> & UnionToIntersectionOfInstances<U[number]>
  >

export type IMixed<T, U extends any[]> = T extends IConstructable
  ? IMixedAsClass<T, U>
  : IMixedAsObject<T, U>

export type IObjectApplier = <T extends IAnyMap, U extends any[]>(target: T, ...mixins: U) => IMixedAsObject<T, U>

export type IClassApplier = <T extends IConstructable, U extends IConstructable[]>(target: T, ...mixins: U) => IMixedAsClass<T, U>

/**
 * Function that extends the target object with several admixtures.
 *
 * applier(target, admixture1, admixture12)
 */
export type IApplier = <T extends any, U extends any[]>(target: T, ...mixins: U) => IMixed<T, U> // eslint-disable-line @typescript-eslint/no-unnecessary-type-constraint
