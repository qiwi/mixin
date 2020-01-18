/** @module @qiwi/mixin */
/** */

import {IAnyMap, UnionToIntersection} from '@qiwi/substrate'
import {
  IConstructable,
  UnionToIntersectionOfConstructable,
  UnionToIntersectionOfNonConstructable,
} from './utility-types'

export * from './utility-types'

export {IAnyMap, UnionToIntersection}

/**
 * Something to be mixed into the target object
 */
export type IAdmixture<T= IAnyMap> = {
  [P in keyof T]: T[P]
}

export type IMixedAsObject<T, U extends any[]> = T & UnionToIntersectionOfNonConstructable<U[number]>

export type IMixedAsClass<T extends IConstructable, U extends any[]> = T & UnionToIntersectionOfConstructable<U[number]> & IConstructable<InstanceType<T> & UnionToIntersectionOfNonConstructable<U[number]>>

export type IMixed<T, U extends any[]> = T extends IConstructable
  ? T & UnionToIntersectionOfConstructable<U[number]> & IConstructable<InstanceType<T> & UnionToIntersectionOfNonConstructable<U[number]>>
  : T & UnionToIntersectionOfNonConstructable<U[number]>

export type IObjectApplier = <T, U extends any[]>(target: T, ...mixins: U) => IMixedAsObject<T, U>

export type IClassApplier = <T extends IConstructable, U extends IConstructable[]>(target: T, ...mixins: U) => IMixedAsClass<T, U>

/**
 * Function that extends the target object with several IAdmixtures.
 *
 * applier(target, admixture1, admixture12)
 */
export type IApplier = <T, U extends any[]>(target: T, ...mixins: U) => IMixed<T, U>

/**
 * A function that somehow modifies the target object
 */
export interface IMixin<U extends any[]> {
  <T extends {}>(target: T): T & UnionToIntersection<U[number]>
}

export interface IConstructor<T = {}> extends Function {
  new (...args: any[]): T
}
