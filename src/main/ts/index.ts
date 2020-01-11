import {IAnyMap} from '@qiwi/substrate'

/**
 * Something to be mixed into the target object
 */
export type IMix<T=IAnyMap> = {
  [P in keyof T]: T[P]
}

/**
 * Function that applies single mixin to the target object.
 * Due to current TS limitations we can not apply & (intersection) opts to entire ...rest of params,
 * so the best way to add several mixins is to compose several mixers:
 *
 * mixer(mixer(target, mixin1), mixin2)
 *
 * @see https://github.com/microsoft/TypeScript/issues/5453
 * @see https://github.com/microsoft/TypeScript/issues/1773
 */
export interface IMixer {
  <T, M>(target: T, mixin: M): T & M
}

export interface IApplyMixins {
  <T, U extends any[]>(target: T, ...mixins: U): T & UnionToIntersection<U[number]>
}

/**
 * How to apply?
 * 1) Prototype injection
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * 2) Target props modification through Object.assignment
 *
 * 3) Proxy chaining
 */

export const mixAsProxy: IMixer = <P extends IAnyMap, M extends IAnyMap>(target: P, mixin: M): P & M => new Proxy(target, {
  get: (obj, prop: string) => {
    return prop in mixin
      // @ts-ignore
      ? mixin[prop]
      // @ts-ignore
      : obj[prop]
  },
}) as P & M

export const mixAsProto = () => { /* todo */ }

export const mixAsProps = () => { /* todo */ }

export type UnionToIntersection<U> = ((U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never)

/**
 *
 * @see https://github.com/microsoft/TypeScript/issues/5453
 * @see https://github.com/microsoft/TypeScript/issues/1773
 * @param target
 * @param mixins
 */
export const applyMixinAsProxy: IApplyMixins = (target, ...mixins) => mixins.reduce(mixAsProxy, target)

