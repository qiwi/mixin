import {
  IConstructable,
  UnionToIntersection,
} from '@qiwi/substrate'

import {
  InstanceTypeOrType,
} from './interface'

export const isFunction = (fn: any): boolean =>
  typeof fn === 'function'
    && typeof fn.prototype.constructor === 'function'

export const isEs5Class = (fn: any): boolean =>
  isFunction(fn)
    && /^function\s[A-Z]/.test(Function.prototype.toString.call(fn))
      && fn.hasOwnProperty('prototype')
        && Object.keys(fn.prototype).length > 0

export const isEs6Class = (fn: any): boolean =>
  isFunction(fn)
    && /^class\s/.test(Function.prototype.toString.call(fn))

export const isClass = (fn: any): boolean => isEs6Class(fn) || isEs5Class(fn)

export const mergeProto = (target: any, ...mixins: any[]) => mergeDescriptors(target.prototype, ...mixins.map(a => a.prototype))

export const mergeDescriptors = <T, U extends any[]>(target: T, ...mixins: U): T & UnionToIntersection<U[number]> =>
  mixins.reduce((m, v) => {
    Object.getOwnPropertyNames(v).forEach(name => {
      if (name === 'prototype' || name === 'constructor' || name === 'length' || name === 'name') {
        return
      }

      Object.defineProperty(
        m,
        name,
        Object.getOwnPropertyDescriptor(v, name) as PropertyDescriptor,
      )
    })

    return m
  }, target)

export const toClassMixin = <T>(target: T) =>
  (isClass(target)
    ? target
    : class {
      constructor() {
        mergeDescriptors(this, target)
      }
    }) as IConstructable<T> & T

export const toObjectMixin = <T extends any>(target: T) =>
  (isClass(target)
    ? target.prototype
    : target
  ) as InstanceTypeOrType<T>
