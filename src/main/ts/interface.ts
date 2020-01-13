/** @module @antongolub/mixin */
/** */

import {IAnyMap, UnionToIntersection} from '@qiwi/substrate'

export * from './utility-types'

export {IAnyMap, UnionToIntersection}

/**
 * Something to be mixed into the target object
 */
export type IAdmixture<T= IAnyMap> = {
  [P in keyof T]: T[P]
}

/**
 * Function that extends the target object with several IAdmixtures.
 *
 * applier(target, admixture1, admixture12)
 */
export interface IApplier {
  <T, U extends any[]>(target: T, ...mixins: U): T & UnionToIntersection<U[number]>
}

/**
 * A function that somehow modifies the target object
 */
export interface IMixin<U extends any[]> {
  <T extends {}>(target: T): T & UnionToIntersection<U[number]>
}

export interface IConstructor<T = {}> extends Function {
  new (...args: any[]): T
}
