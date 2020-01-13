export interface IConstructable<T = {}> extends Function {
  new (...args: any[]): T
}

export type InstanceTypeOrNever<T> = T extends IConstructable
  ? InstanceType<T>
  : never

export type InstanceTypeOrType<T> = T extends IConstructable
  ? InstanceType<T>
  : T

export type UnionToIntersectionOfInstanceType<U> = (U extends any
  ? (k: InstanceTypeOrNever<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never

export type UnionToIntersectionOfInstanceTypeOrType<U> = (U extends any
  ? (k: InstanceTypeOrType<U>) => void
  : never) extends (k: infer I) => void
  ? I
  : never

// https://github.com/microsoft/TypeScript/issues/17572
export type Abstract<T={}> = Function & {prototype: T};
export type Constructor<T={}> = new (...args: any[]) => T;
export type Class<T={}> = Abstract<T> & Constructor<T>;
