/** @module @antongolub/mixin */
/** */

import {
  IApplier,
  IAnyMap,
  IConstructable,
  UnionToIntersection,
  UnionToIntersectionOfInstanceType,
  UnionToIntersectionOfInstanceTypeOrType,
} from './interface'

import {
  mergeProto,
  mergeDescriptors,
  isClass,
  toClassMixin,
  toObjectMixin,
} from './util'

export const applyMixinsAsProxy: IApplier = <T extends IAnyMap, U extends IAnyMap[]>(target: T, ...mixins: U) => {
  mixins.reverse() // lifo

  return new Proxy(target, {
    get: (obj, prop: string) => {
      const mixin = mixins.find(mixin => prop in mixin)

      return mixin
        ? mixin[prop]
        : obj[prop]
    },
  }) as T & UnionToIntersection<U[number]>
}

export const applyMixinsAsMerge: IApplier = <T extends IAnyMap, U extends IAnyMap[]>(target: T, ...mixins: U) =>
  mergeDescriptors(target, ...mixins)

// NOTE typeof Class does not equal to class type itself, so U[number] hook is incompatible here
export const applyMixinsAsSubclass = <T extends IConstructable, U extends any[]>(target: T, ...mixins: U) => {
  class Mixed extends target {

    constructor(...args: any[]) {
      super(...args)
      applyMixinsAsMerge(this, ...mixins.map(M => new M(...args)))
    }

  }

  return applyMixinsAsProto(Mixed, target, ...mixins) as T
    & UnionToIntersection<U[number]>
    & IConstructable<InstanceType<T> & UnionToIntersectionOfInstanceType<U[number]>>
}

export const applyMixinsAsProto = <T extends IConstructable, U extends IConstructable[]>(target: T, ...mixins: U) => {
  mergeProto(target, ...mixins)
  mergeDescriptors(target, ...mixins)

  return target as T
    & UnionToIntersection<U[number]>
    & IConstructable<InstanceType<T> & UnionToIntersectionOfInstanceType<U[number]>>
}

export const applyMixins = <T, U extends any[]>(target: T, ...mixins: U) =>
  (isClass(target)
    ? applyMixinsAsSubclass(target as T & IConstructable, ...mixins.map(toClassMixin))
    : applyMixinsAsMerge(target, ...mixins.map(toObjectMixin))
  ) as T
      & UnionToIntersectionOfInstanceTypeOrType<U[number]>
      & IConstructable<InstanceType<T & IConstructable> & UnionToIntersectionOfInstanceTypeOrType<U[number]>>
