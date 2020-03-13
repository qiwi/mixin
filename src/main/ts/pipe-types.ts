import {
  IExtendsCondition,
  PrependTuple,
  Unary,
  UnaryOrIntersectionTypeFactory,
} from './utility-types'

// Adapted from https://github.com/Kotarski/ts-functionaltypes

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

export type IPipeApplier = <F extends any[]>(...funcs: UnariesToPiped<F>) =>
  (i: ParameterUnary<UnaryOrIntersectionTypeFactory<F[0]>>) => ReturnType<UnariesToPiped<F>[PrevN<F['length']>]>
