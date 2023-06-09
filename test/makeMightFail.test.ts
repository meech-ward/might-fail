import { expect, test } from "vitest"
import { makeMightFail } from "../src/index"


test("success returns the response", async () => {
  const resolve = (value: {message: string}) => Promise.resolve(value);
  const func = makeMightFail(resolve)
  const {error, result} = await func({message: "success"})
  expect(error).toBe(undefined)
  expect(result!.message).toBe("success")
})

test("fail with error returns the error", async () => {
  const reject = (error: Error) => Promise.reject(error);
  const func = makeMightFail(reject)
  const {error, result} = await func(new Error("error"))
  expect(result).toBe(undefined)
  expect(error?.message).toBe("error")
})

test("fail without error returns an error", async () => {
  const reject = () => Promise.reject(undefined);
  const func = makeMightFail(reject)
  const {error, result} = await func()
  expect(result).toBe(undefined)
  expect(error?.message).toBeTruthy()
})