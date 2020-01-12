export interface IConstructable<T = {}> extends Function {
  new (...args: any[]): T
}

export type InstanceTypeOrNever<T> = T extends IConstructable
  ? InstanceType<T>
  : never

export type UnionToInstanceTypeIntersection<U> = (U extends any
  ? (k: InstanceTypeOrNever<U>) => void
  : never) extends (k: infer I) => void
    ? I
    : never
