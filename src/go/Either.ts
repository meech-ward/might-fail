import { createArrayProxy } from "../utils"
/**
 * Either type represents a data structure that encapsulates a successful result or an Error.
 * It wraps the result of a Promise in an object, making it easier to handle errors by returning
 * an object that either contains a 'result' value of type T (if successful), or an 'error' of type Error.
 *
 * @template T The type of the result value.
 */
export type Either<T> =
  | ({
      error: Error
      result: undefined
    } & [undefined, Error])
  | ({
      result: T
      error: undefined
    } & [T, undefined])






export const createEither = <T>({
  result,
  error,
}:
  | {
      error: Error
      result: undefined
    }
  | {
      error: undefined
      result: T
    }): Either<T> => {
  if (error) {
    const array: [undefined, Error] = [undefined, error]
    // const obj = Object.create(array)
    const obj = {} as any
    obj.error = error
    obj.result = undefined
    return createArrayProxy<T>(obj, array)
  }
  const array: [T, undefined] = [result, undefined]
  // const obj = Object.create(array)
  const obj = {} as any
  obj.error = undefined
  obj.result = result
  return createArrayProxy<T>(obj, array)
}
