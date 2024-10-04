import { EitherMode, MightFailFunction } from "./utils.type"

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === "string") {
    return new Error(error)
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return new Error(error.message)
    }
    return new Error(error as any)
  }
  return new Error("Unknown error")
}

export const makeProxyHandler = <TMightFailFunction extends MightFailFunction<EitherMode>>(
  mightFailFunction: TMightFailFunction
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

export const createArrayProxy = <T>(obj: any, array: (undefined | Error | T)[]) => {
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
            console.log(`Array method called: ${String(prop)}, Arguments: ${args}`)
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
            console.log(`Iterating item: ${item}`)
            yield item
          }
        }
      }

      return undefined
    },
  })
}
