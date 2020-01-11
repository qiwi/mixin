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

// NOTE typeof Class does not equal to class type itself, so U[number] hook is incompatible here
export const applyMixinsAsSubclass = <T extends IConstructor, M0 extends IConstructor, M1 extends IConstructor>(target: T, m0: M0, m1: M1) => {
  function Mixed(...args: any[]): T & M0 & M1 {
    // @ts-ignore
    target.call(this, ...args)

    // @ts-ignore
    return this
  }
  // @ts-ignore
  Mixed.prototype = Object.create(target.prototype)

  // Object.assign(Mixed, ...mixins)
  const ms = [m0, m1].filter(v => !!v)
  mergeProto(Mixed, ...ms)

// @ts-ignore
  return Mixed as T & M0 & M1 & {
    new (...args: any[]): InstanceType<T> & InstanceType<M0> & InstanceType<M1>
  }
}

// export const applyMixinsAsProto: IApplier = () => { /* todo */ }
