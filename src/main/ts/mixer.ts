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
export const applyMixinsAsSubclass = <T, M0, M1, M2, M3, M4, M5, M6, M7, M8, M9>(target: T, ...mixins: Array<M0 | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9>): IConstructor<T> & T & M0 & M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8 & M9 => {
  const Base = target as unknown as IConstructor<any>
  class Mixed extends Base {
    constructor(...args: any[]) {
      super(...args)
      //mixins.forEach(m => m.call(this, ...args))
    }
  }
  // Object.assign(Mixed, ...mixins)
  mergeProto(Mixed, ...mixins)

  return Mixed as IConstructor<T> & T & M0 & M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8 & M9
}

// export const applyMixinsAsProto: IApplier = () => { /* todo */ }
