export const isEs5Class = (fn: any): boolean =>
  typeof fn === 'function'
    && /^function\s[A-Z]/.test(Function.prototype.toString.call(fn))
      && fn.hasOwnProperty('prototype')
        && Object.keys(fn.prototype).length > 0

export const isEs6Class = (fn: any): boolean =>
  typeof fn === 'function'
    && /^class\s/.test(Function.prototype.toString.call(fn))

export const isClass = (fn: any): boolean => isEs6Class(fn) || isEs5Class(fn)
