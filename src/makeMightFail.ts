import Either from './Either'
import mightFail from './mightFail'

/**
 * Utility type that unwraps a Promise type. If T is a Promise, it extracts the type the Promise resolves to.
 *
 * @template T The type to be unwrapped if it's a Promise.
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Wraps a promise-returning function in a function that returns an Either. This function takes a function
 * which returns a Promise, and returns a new function that when called, will return an Either.
 *
 * @export
 * @template T The type of the function to be wrapped.
 * @param {T} func The function to be wrapped.
 * @return {(...funcArgs: Parameters<T>) => Either<UnwrapPromise<ReturnType<T>>>} 
 * A new function that takes the same arguments as the original function, but returns an Either.
 */
export default function makeMightFail<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...funcArgs: Parameters<T>) => Either<UnwrapPromise<ReturnType<T>>> {
  return async (...args: Parameters<T>): Either<UnwrapPromise<ReturnType<T>>> => {
    const promise = func(...args)
    return mightFail(promise)
  }
}
