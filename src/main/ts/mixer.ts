/** @module @antongolub/mixin */
/** */

import {IApplier, IAnyMap, UnionToIntersection, IConstructor} from './interface'
import {mergeProto} from './util'

export const applyMixinsAsProxy: IApplier = <T extends IAnyMap, U extends IAnyMap[]>(target: T, ...mixins: U) => new Proxy(target, {
  get: (obj, prop: string) => {
    const mixin = mixins.find(mixin => prop in mixin)

    return mixin
      ? mixin[prop]
      : obj[prop]
  },
}) as T & UnionToIntersection<U[number]>

export const applyMixinsAsMerge: IApplier = <T extends IAnyMap, U extends IAnyMap[]>(target: T, ...mixins: U) =>
  mixins.reduce(
    (m, v) => Object.assign(m, v),
    target
  ) as T & UnionToIntersection<U[number]>

export type InstanceOrNever<T> = (T extends IConstructor ? InstanceType<T> : never)

export type UnionInstanceTypeIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends (k: infer I) => void
    ? InstanceOrNever<I>
    : never

// NOTE typeof Class does not equal to class type itself, so U[number] hook is incompatible here
export const applyMixinsAsSubclass: IApplier = <T, U extends any[]>(target: T, ...mixins: U) => {
  function Mixed(...args: any[]) {
    // @ts-ignore
    applyMixinsAsMerge(this, ...mixins.map(M => new M(...args)))
  }
  // @ts-ignore
  Mixed.prototype = Object.create(target.prototype)

  // Object.assign(Mixed, ...mixins)
  mergeProto(Mixed, ...mixins)

  return Mixed as IConstructor & T & UnionToIntersection<U[number]> & {
    new (...args: any[]): InstanceOrNever<T> & UnionInstanceTypeIntersection<U[number]>
  }
}

// export const applyMixinsAsProto: IApplier = () => { /* todo */ }
