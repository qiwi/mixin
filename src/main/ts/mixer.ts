/** @module @qiwi/mixin */
/** */

import {
  IAnyMap,
  IConstructable,
} from '@qiwi/substrate'

import {
  IApplier,
  IClassApplier,
  IObjectApplier,
  IMixedAsObject,
  IMixedAsClass,
  IMixed, IExtendsCondition,
} from './interface'

// import {ParameterUnary, PrevN, UnariesToPiped, Unary} from './pipe-types'

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

/*
type FunctionOrNever<T> = IExtendsCondition<T, IFunction, T, IFunction>

type UnionToIntersectionOfReturn<U, F> = (U extends IFunction
  ? (k: ReturnType<FunctionOrNever<U>>) => void
  : F) extends (k: infer I) => void
    ? I
    : void

type ComposableOn<F extends IFunction> = F extends (...x: any[]) => infer U ? (y: U) => any : never;

type IResultTypeOfLast<T extends IFunction, U extends IFunction[]> = (...args: Parameters<T>) => UnionToIntersectionOfReturn<U, ReturnType<T>>

export const applyMixinsAsFactory = <T extends IFunction, U extends IFunction[]>(target: T, ...mixins: U): IResultTypeOfLast<T, U> =>
  (...args: Parameters<typeof target>) => mixins.reduce((m, v) => v(m), target(...args))*/

// type IFunction = (...any: any[]) => any

export type FnOrResult<T> = IExtendsCondition<T, Unary, T, <V>(v: V) => V & T>
// export type FnOrResult<T> = IExtendsCondition<T, Unary, T, <V>(v: V) => V & T>

export const toFnMixin = <T>(target: T) =>
  (typeof target === 'function'
    ? target
    : <T>(i: T) => ({...i, ...target})
  ) as FnOrResult<T>

// Util to prepend a value to a Tuple from: https://stackoverflow.com/a/54607819/5308589
export type PrependTuple<A, T extends Array<any>> =
  (((a: A, ...b: T) => void) extends (...a: infer I) => void ? I : [])

// tslint:disable no-multi-spaces
export type SNumbers = [
  '0',  '1',  '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',  '10', '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',
  '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
  '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63']

export type Numbers = [
  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]
// tslint:enable no-multi-spaces

// Get the previous number (for indexing)    (2=>1, 1=>0, 0=>never)
export type PrevN<T extends number> = PrependTuple<never, Numbers>[T]

// Convert a string index to a number
export type S_N<S extends SNumbers[number]> = {
  [K in SNumbers[number]]: Numbers[K]
}[S]

// Only unary functions wanted
// export type Unary = <T>(i: T) => T;
export type Unary = (i: any) => any

// Get the (single) argument of a given unary function
export type ParameterUnary<F extends Unary> = Parameters<F>['0']

// Iterate through the unaries
// For each previous/current pair, the previous return values should be applicable to the current parameter value
// If it doesn't this function maps to the correct value
// When we try to apply the actual type we get a mismatch which is easier to diagnose
export type UnariesToPiped<F extends any[]> = {
  [K in keyof F]:
  K extends SNumbers[number] ?
    K extends '0'
      ? F[K]
      : IExtendsCondition<
        F[K],
        Unary,
        (i: ReturnType<F[PrevN<S_N<K>>]>) => ReturnType<F[PrevN<S_N<K>>]> & ReturnType<F[S_N<K>]>,
        F[K]
      >
    : F[K]
}

type IFunction<R= any, A extends any[]= any[]> = R extends Unary ? R : (...args: A) => R

export type UnionToIntersectionOfFnReturn<U> = (U extends any
  ? (k: ReturnType<IFunction<U>>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

/**
 * The type for the pipe function
 * @example const pipe: Pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
 */
// export type Pipe = <F extends any[]>(...funcs: UnariesToPiped<F>) => (i: ParameterUnary<FnOrResult<F[0]>>) => UnionToIntersectionOfFnReturn<F>
// export type Pipe = <F extends any[]>(...funcs: UnariesToPiped<F>) => (i: ParameterUnary<FnOrResult<F[0]>>) => ReturnType<FnOrResult<F[PrevN<F["length"]>]>>
export type Pipe = <F extends any[]>(...funcs: UnariesToPiped<F>) =>
  // (i: ParameterUnary<FnOrResult<F[0]>>) => ReturnType<UnariesToPiped<F>[PrevN<F["length"]>]>
  (i: ParameterUnary<FnOrResult<F[0]>>) => ReturnType<UnariesToPiped<F>[PrevN<F['length']>]>

// ReturnType<typeof toFnMixin>[]
export const applyMixinsAsFactory: Pipe = (...fns) => x => fns
  .map(toFnMixin)
  .reduce((v, f) => f(v), x)
