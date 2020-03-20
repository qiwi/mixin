import {
  IExtendsCondition,
  PrependTuple,
  Unary,
  UnaryOrIntersectionTypeFactory,
} from './utility-types'

import {
  SNumbers,
  Numbers,
  Ranges,
} from './pipe-types-magic'

// Adapted from https://github.com/Kotarski/ts-functionaltypes

// Get the previous number (for indexing)    (2=>1, 1=>0, 0=>never)
export type PrevN<T extends number> = PrependTuple<never, Numbers>[T]

// Convert a string index to a number
export type S2N<S extends SNumbers[number]> = {
  [K in SNumbers[number]]: Numbers[K]
}[S]

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
        (i: PipeResult<F[Ranges[PrevN<S2N<K>>]]>) => PipeResult<F[Ranges[PrevN<S2N<K>>]]> & ReturnType<F[S2N<K>]>,
        F[K]
      >
    : F[K]
}

type ReturnTypeOrType<T> = T extends (...args: any[]) => infer R ? R : T

export type PipeResult<U> = ((U extends any
  ? (k: ReturnTypeOrType<U>) => void
  : never
  ) extends ((k: infer I) => void) ? I : never)

export type IPipeApplier = <F extends any[]>(...funcs: UnariesToPiped<F>) =>
  (i: ParameterUnary<UnaryOrIntersectionTypeFactory<F[0]>>) => PipeResult<F[number]>
