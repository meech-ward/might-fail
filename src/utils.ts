import { EitherMode, MightFailFunction } from "./utils.type"

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
