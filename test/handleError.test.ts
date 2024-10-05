import { expect, test } from "vitest"
import { mightFail, mightFailSync } from "../src"

test("must modify the stack trace", async () => {
  const { error } = await mightFail(Promise.reject("error"))

  expect(error).toBeDefined()
  expect(error?.stack).toBeDefined()

  const stack = error?.stack?.split("\n")
  expect(stack?.length).toBeGreaterThan(1)
  expect(stack?.[0]).toBe("Error: error")
  expect(stack?.[1]).include("at processTicksAndRejections")
})

test("must not reveal might-fail trace when thrown from a function", async () => {
  async function throwError() {
    function throwErrorSync() {
      throw "error"
    }

    throwErrorSync()
  }

  const { error } = await mightFail(throwError())

  const stack = error?.stack?.split("\n")
  expect(stack?.length).toBeGreaterThan(1)
  expect(stack?.[0]).toBe("Error: error")
  expect(stack?.[1]).include("at processTicksAndRejections")
})

test("must not reveal might-fail trace when used with mightFailSync", async () => {
  function throwError() {
    function throwErrorSync() {
      throw "error"
    }

    throwErrorSync()
  }

  const { error } = mightFailSync(throwError)

  const stack = error?.stack?.split("\n")
  expect(stack?.length).toBeGreaterThan(1)
  expect(stack?.[0]).toBe("Error: error")
  expect(stack?.[1]).include("handleError.test.ts")
})

test("must not reveal might-fail trace when passed an object", async () => {
  function throwError() {
    function throwErrorSync() {
      throw { message: "error" }
    }

    throwErrorSync()
  }

  const { error } = mightFailSync(throwError)

  const stack = error?.stack?.split("\n")
  expect(stack?.length).toBeGreaterThan(1)
  expect(stack?.[0]).toBe("Error: error")
  expect(stack?.[1]).include("handleError.test.ts")

  async function throwErrorAsync() {
    function throwErrorSync() {
      throw { message: "error" }
    }

    throwErrorSync()
  }

  const { error: errorAsync } = await mightFail(throwErrorAsync())

  const stack2 = errorAsync?.stack?.split("\n")
  expect(stack2?.length).toBeGreaterThan(1)
  expect(stack2?.[0]).toBe("Error: error")
  expect(stack2?.[1]).include("at processTicksAndRejections")
})

test("must not reveal might-fail trace when passed an exotic object", async () => {
  function throwError() {
    function throwErrorSync() {
      throw { foo: "error", bar: "baz" }
    }

    throwErrorSync()
  }

  const { error } = mightFailSync(throwError)

  const stack = error?.stack?.split("\n")
  expect(stack?.length).toBeGreaterThan(1)
  expect(stack?.[0]).toBe("Error: [object Object]")
  expect(stack?.[1]).include("handleError.test.ts")

  async function throwErrorAsync() {
    function throwErrorSync() {
      throw { foo: "error", bar: "baz" }
    }

    throwErrorSync()
  }

  const { error: errorAsync } = await mightFail(throwErrorAsync())

  const stack2 = errorAsync?.stack?.split("\n")
  expect(stack2?.length).toBeGreaterThan(1)
  expect(stack2?.[0]).toBe("Error: [object Object]")
  expect(stack2?.[1]).include("at processTicksAndRejections")
})

test("must not reveal might-fail trace when passed an unknown/unexpected type", async () => {
  function throwError() {
    function throwErrorSync() {
      throw 4
    }

    throwErrorSync()
  }

  const { error } = mightFailSync(throwError)

  const stack = error?.stack?.split("\n")
  expect(stack?.length).toBeGreaterThan(1)
  expect(stack?.[0]).toBe("Error: Unknown error")
  expect(stack?.[1]).include("handleError.test.ts")

  async function throwErrorAsync() {
    function throwErrorSync() {
      throw 4
    }

    throwErrorSync()
  }

  const { error: errorAsync } = await mightFail(throwErrorAsync())

  const stack2 = errorAsync?.stack?.split("\n")
  expect(stack2?.length).toBeGreaterThan(1)
  expect(stack2?.[0]).toBe("Error: Unknown error")
  expect(stack2?.[1]).include("at processTicksAndRejections")
})
