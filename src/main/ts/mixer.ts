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
  mergeDescriptors,
  isClass
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
export const applyMixinsAsSubclass = <T extends Class, U extends any[]>(target: T, ...mixins: U) => {
  class Mixed extends target {
    constructor(...args: any[]) {
      super(...args)
      applyMixinsAsMerge(this, ...mixins.map(M => new M(...args)))
    }
  }

  return applyMixinsAsProto(Mixed, target, ...mixins) as T
    & UnionToIntersection<U[number]>
    & IConstructable<InstanceType<T> & UnionToInstanceTypeIntersection<U[number]>>
}

export const applyMixinsAsProto = <T extends Class, U extends Class[]>(target: T, ...mixins: U) => {
  mergeProto(target, ...mixins)
  mergeDescriptors(target, ...mixins)

  return target as T
    & UnionToIntersection<U[number]>
    & IConstructable<InstanceType<T> & UnionToInstanceTypeIntersection<U[number]>>
}

// https://github.com/microsoft/TypeScript/issues/17572
type Abstract<T={}> = Function & {prototype: T};
type Constructor<T={}> = new (...args: any[]) => T;
type Class<T={}> = Abstract<T> & Constructor<T>;

export const applyMixins = <T, U extends any[]>(target: T, ...mixins: U) =>
  isClass(target)
    ? applyMixinsAsSubclass(target as T & Class, ...mixins)
    : applyMixinsAsMerge(target, ...mixins) as T
      & UnionToIntersection<U[number]>
      & IConstructable<InstanceType<T & IConstructable> & UnionToInstanceTypeIntersection<U[number]>>

