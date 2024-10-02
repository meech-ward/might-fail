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
