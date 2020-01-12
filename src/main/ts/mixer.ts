/** @module @antongolub/mixin */
/** */

import {
  IApplier,
  IAnyMap,
  IConstructable,
  UnionToIntersection,
  UnionToInstanceTypeIntersection
} from './interface'

import {
  mergeProto,
  mergeDescriptors
} from './util'

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
export const applyMixinsAsSubclass = <T extends IConstructable, U extends any[]>(target: T, ...mixins: U) => {
  /*function Mixed(...args: any[]) {
    // @ts-ignore
    applyMixinsAsMerge(this, ...mixins.map(M => new M(...args)))
  }*/
  // @ts-ignore
  //Mixed.prototype = Object.create(target.prototype)

  class Mixed extends target {
    constructor(...args: any[]) {
      super(...args)
      applyMixinsAsMerge(this, ...mixins.map(M => new M(...args)))
    }
  }

  return applyMixinsAsProto(Mixed, target, ...mixins) as T & UnionToIntersection<U[number]> & {
    new (...args: any[]): InstanceType<T> & UnionToInstanceTypeIntersection<U[number]>
  }
}

export const applyMixinsAsProto = <T extends IConstructable, U extends IConstructable[]>(target: T, ...mixins: U) => {
  mergeProto(target, ...mixins)
  mergeDescriptors(target, ...mixins)

  return target as T & UnionToIntersection<U[number]> & {
    new (...args: any[]): InstanceType<T> & UnionToInstanceTypeIntersection<U[number]>
  }
}
