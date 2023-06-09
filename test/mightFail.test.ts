import { expect, test } from "vitest"
import { mightFail } from "../src/index"


test("success returns the response", async () => {
  const {error, result} = await mightFail(Promise.resolve("success"))
  expect(result).toBe("success")
  expect(error).toBe(undefined)
})

test("fail with error returns the error", async () => {
  const {error, result} = await mightFail(Promise.reject(new Error("error")))
  expect(result).toBe(undefined)
  expect(error?.message).toBe("error")
})

test("fail without error returns an error", async () => {
  const {error, result} = await mightFail(Promise.reject(undefined))
  expect(result).toBe(undefined)
  expect(error?.message).toBeTruthy()
})