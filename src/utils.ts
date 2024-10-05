import { EitherMode, MightFailFunction } from "./utils.type"
import { Either as StandardEither } from "./Either"
import { Either as GoEither } from "./go/Either"

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === "string") {
    return createErrorWithoutMightFailStackTraces(error)
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return createErrorWithoutMightFailStackTraces(error.message)
    }
    return createErrorWithoutMightFailStackTraces(error as any)
  }
  return createErrorWithoutMightFailStackTraces("Unknown error")
}

function createErrorWithoutMightFailStackTraces(message: any): Error {
  const error = new Error(message)

  const stack = error.stack?.split("\n")
  stack?.splice(1, 3)
  error.stack = stack?.join("\n")

  return error
}

export const makeProxyHandler = <TMightFailFunction extends MightFailFunction<EitherMode>>(
  mightFailFunction: TMightFailFunction,
) => ({
  get(_: TMightFailFunction, property: string) {
    if (Object.getOwnPropertyDescriptor(Promise, property) === undefined) {
      return mightFailFunction(Promise.reject(new Error(`property ${property} not found on Promise`)))
    }

    const value = (Promise as any)[property]

    if (typeof value !== "function") {
      return mightFailFunction(Promise.reject(new Error(`property ${property} is not a Promise method`)))
    }

    return function (...args: any[]) {
      const promise = value.apply(Promise, args)
      return mightFailFunction(promise)
    }
  },
})

export const createEither = <T, TEitherMode extends EitherMode = "standard">(
  {
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
      },
  eitherMode: EitherMode = "standard",
): TEitherMode extends "standard" ? StandardEither<T> : GoEither<T> => {
  if (error) {
    const array = eitherMode === "standard" ? [error, undefined] : [undefined, error]
    const obj = {} as any
    obj.error = error
    obj.result = undefined
    return createArrayProxy<T>(obj, array)
  }
  const array = eitherMode === "standard" ? [undefined, result] : [result, undefined]
  const obj = {} as any
  obj.error = undefined
  obj.result = result
  return createArrayProxy<T>(obj, array)
}

const createArrayProxy = <T>(obj: any, array: (undefined | Error | T)[]) => {
  // Proxy to intercept array methods and properties
  return new Proxy(obj, {
    get(target, prop, receiver) {
      // If the property exists on the object itself, return it
      if (prop in target) {
        return Reflect.get(target, prop, receiver)
      }

      // If the property exists on the internal array, proxy it
      if (prop in array) {
        const value = (array as any)[prop] // TypeScript array typing here
        if (typeof value === "function") {
          // Proxy array methods
          return function (...args: any[]) {
            return value.apply(array, args)
          }
        } else {
          // Return array properties (like length)
          return value
        }
      }

      // Handle the iterator separately
      if (prop === Symbol.iterator) {
        const originalIterator = array[Symbol.iterator]()
        return function* () {
          for (let item of originalIterator) {
            yield item
          }
        }
      }

      return undefined
    },
  })
}
