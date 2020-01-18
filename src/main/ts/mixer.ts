/** @module @qiwi/mixin */
/** */

import {
  IApplier,
  IClassApplier,
  IObjectApplier,
  IAnyMap,
  IConstructable,
  IMixedAsObject,
  IMixedAsClass,
  IMixed,
} from './interface'

import {
  mergeProto,
  mergeDescriptors,
  isClass,
  toClassMixin,
  toObjectMixin,
} from './util'

export const applyMixinsAsProxy: IObjectApplier = <T extends IAnyMap, U extends IAnyMap[]>(target: T, ...mixins: U) => {
  mixins.reverse() // lifo

  return new Proxy(target, {
    get: (obj, prop: string) => {
      const mixin = mixins.find(mixin => prop in mixin)

      return mixin
        ? mixin[prop]
        : obj[prop]
    },
  }) as IMixedAsObject<T, U>
}

export const applyMixinsAsMerge: IObjectApplier = <T extends IAnyMap, U extends IAnyMap[]>(target: T, ...mixins: U) =>
  mergeDescriptors(target, ...mixins) as IMixedAsObject<T, U>

// NOTE typeof Class does not equal to class type itself, so U[number] hook is incompatible here
export const applyMixinsAsSubclass: IClassApplier = <T extends IConstructable, U extends IConstructable[]>(target: T, ...mixins: U) => {
  class Mixed extends target {

    constructor(...args: any[]) {
      super(...args)
      mergeDescriptors(this, ...mixins.map(M => new M(...args)))
    }

  }

  return applyMixinsAsProto(Mixed, target, ...mixins) as IMixedAsClass<T, U>
}

export const applyMixinsAsProto: IClassApplier = <T extends IConstructable, U extends IConstructable[]>(target: T, ...mixins: U) => {
  mergeProto(target, ...mixins)
  mergeDescriptors(target, ...mixins)

  return target as IMixedAsClass<T, U>
}

export const applyMixins: IApplier = <T, U extends any[]>(target: T, ...mixins: U) =>
  (isClass(target)
    ? applyMixinsAsSubclass(target as T & IConstructable, ...mixins.map(toClassMixin))
    : applyMixinsAsMerge(target, ...mixins.map(toObjectMixin))
  ) as IMixed<T, U>
