import Either from './Either'
import mightFail from './mightFail'

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export default function makeMightFail<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...funcArgs: Parameters<T>) => Either<UnwrapPromise<ReturnType<T>>> {
  return async (...args: Parameters<T>): Either<UnwrapPromise<ReturnType<T>>> => {
    const promise = func(...args)
    return mightFail(promise)
  }
}
