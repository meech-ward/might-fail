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
    } & [Error, undefined])
  | ({
      result: T
      error: undefined
    } & [undefined, T])

// Note this array interface is undesireable, we would much rather use just an itterator here but TS doesn't yet support that well enough
// So it has an array interface and proxies array methods. 
// See the utils `makeEither` for more information.