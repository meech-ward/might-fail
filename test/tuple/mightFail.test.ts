import { describe, expect, it, test } from "vitest"
import { mightFail } from "../../src/tuple/index"

test("success returns the response", async () => {
  const [error, result] = await mightFail(Promise.resolve("success"))
  expect(result).toBe("success")
  expect(error).toBe(undefined)
})

test("fail with error returns the error", async () => {
  const [error, result] = await mightFail(Promise.reject(new Error("error")))
  expect(result).toBe(undefined)
  expect(error?.message).toBe("error")
})

test("fail without error returns an error", async () => {
  const [error, result] = await mightFail(Promise.reject(undefined))
  expect(result).toBe(undefined)
  expect(error?.message).toBeTruthy()
})

test("fail with string returns an error with that string as the message", async () => {
  const [error, result] = await mightFail(Promise.reject("error"))
  expect(result).toBe(undefined)
  expect(error?.message).toBe("error")
})

test("fail with object returns an error with that object as the message", async () => {
  const [error, result] = await mightFail(Promise.reject({ message: "error" }))
  expect(result).toBe(undefined)
  expect(error?.message).toBe("error")
})

test("async function that throws", async () => {
  const asyncFn = async () => {
    throw new Error("async error")
  }
  const [error, result] = await mightFail(asyncFn())
  expect(result).toBe(undefined)
  expect(error?.message).toBe("async error")
})

test("promise that resolves after delay", async () => {
  const delayedPromise = new Promise((resolve) => setTimeout(() => resolve("delayed success"), 100))
  const [error, result] = await mightFail(delayedPromise)
  expect(result).toBe("delayed success")
  expect(error).toBe(undefined)
})

test("promise that rejects after delay", async () => {
  const delayedPromise = new Promise((_, reject) => setTimeout(() => reject("delayed error"), 100))
  const [error, result] = await mightFail(delayedPromise)
  expect(result).toBe(undefined)
  expect(error?.message).toBe("delayed error")
})

describe("promise concurrent method wrappers", () => {
  describe("mightFail.all", () => {
    it("should resolve with all values when all promises succeed", async () => {
      const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
      const [error, result] = await mightFail.all(promises)
      expect(error).toBeUndefined()
      expect(result).toEqual([1, 2, 3])
    })

    it("should return an error if any promise fails", async () => {
      const promises = [Promise.resolve(1), Promise.reject(new Error("Test Error")), Promise.resolve(3)]
      const [error, result] = await mightFail.all(promises)
      expect(result).toBeUndefined()
      expect(error).toBeInstanceOf(Error)
      expect(error!.message).toBe("Test Error")
    })
  })

  describe("mightFail.race", () => {
    it("should resolve with the first resolved value", async () => {
      const promises = [Promise.resolve(42), new Promise((resolve) => setTimeout(() => resolve(100), 100))]
      const [error, result] = await mightFail.race(promises)
      expect(error).toBeUndefined()
      expect(result).toBe(42)
    })

    it("should return an error if the first promise to settle is a rejection", async () => {
      const promises = [Promise.reject(new Error("Race Error")), Promise.resolve(100)]
      const [error, result] = await mightFail.race(promises)
      expect(result).toBeUndefined()
      expect(error).toBeInstanceOf(Error)
      expect(error!.message).toBe("Race Error")
    })
  })

  describe("mightFail.allSettled", () => {
    it("should resolve with all settled results, including fulfilled and rejected promises", async () => {
      const promises = [Promise.resolve(1), Promise.reject(new Error("AllSettled Error")), Promise.resolve(3)]
      const [error, result] = await mightFail.allSettled(promises)
      expect(error).toBeUndefined()
      expect(result).toEqual([
        { status: "fulfilled", value: 1 },
        { status: "rejected", reason: new Error("AllSettled Error") },
        { status: "fulfilled", value: 3 },
      ])
    })
  })

  describe("mightFail.any", () => {
    it("should resolve with the first successful promise", async () => {
      const promises = [
        Promise.reject(new Error("Error 1")),
        Promise.resolve(200),
        Promise.reject(new Error("Error 2")),
      ]
      const [error, result] = await mightFail.any(promises)
      expect(error).toBeUndefined()
      expect(result).toBe(200)
    })

    it("should return an AggregateError if all promises fail", async () => {
      const promises = [Promise.reject(new Error("Error 1")), Promise.reject(new Error("Error 2"))]
      const [error, result] = await mightFail.any(promises)
      expect(result).toBeUndefined()
      expect(error).toBeInstanceOf(Error)
      expect(error!.message).toBe("All promises were rejected")
    })
  })
})
