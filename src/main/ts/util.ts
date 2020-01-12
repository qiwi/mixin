import {UnionToIntersection} from "./interface";

export const isEs5Class = (fn: any): boolean =>
  typeof fn === 'function'
    && /^function\s[A-Z]/.test(Function.prototype.toString.call(fn))
      && fn.hasOwnProperty('prototype')
        && Object.keys(fn.prototype).length > 0

export const isEs6Class = (fn: any): boolean =>
  typeof fn === 'function'
    && /^class\s/.test(Function.prototype.toString.call(fn))

export const isClass = (fn: any): boolean => isEs6Class(fn) || isEs5Class(fn)

export const mergeProto = (target: any, ...mixins: any[]) => mergeDescriptors(target.prototype, ...mixins.map(a => a.prototype))

export const mergeDescriptors = <T, U extends any[]>(target: T, ...mixins: U): T & UnionToIntersection<U[number]> =>
  mixins.reduce((m, v) => {
    Object.getOwnPropertyNames(v).forEach(name => {
      if (name === 'prototype') {
        return
      }
      Object.defineProperty(
        m,
        name,
        Object.getOwnPropertyDescriptor(v, name) as PropertyDescriptor)
    })

    return target
  }, target)
