import { expect, test } from "vitest"
import { makeMightFailSync } from "../../src/go/index"

function somethingThatThrows(input: string) {
  if (!input) {
    throw new Error("error")
  }
  return { message: input }
}

test("success returns the response", async () => {
  const func = makeMightFailSync(somethingThatThrows)
  const [result, error] = await func("success")
  expect(error).toBe(undefined)
  expect(result!.message).toBe("success")
})

test("fail with error returns the error", async () => {
  const func = makeMightFailSync(somethingThatThrows)
  const [result, error] = await func("")
  expect(result).toBe(undefined)
  expect(error?.message).toBe("error")
})

test("fail without error returns an error", async () => {
  const reject = () => {
    throw "a fit"
  }
  const func = makeMightFailSync(reject)
  const [result, error] = await func()
  expect(result).toBe(undefined)
  expect(error?.message).toBeTruthy()
})
