import { expect, test } from "vitest";
import { mightFail } from "../../src/tuple/index";

test("success returns the response", async () => {
  const [error, result] = await mightFail(Promise.resolve("success"));
  expect(result).toBe("success");
  expect(error).toBe(undefined);
});

test("fail with error returns the error", async () => {
  const [error, result] = await mightFail(Promise.reject(new Error("error")));
  expect(result).toBe(undefined);
  expect(error?.message).toBe("error");
});

test("fail without error returns an error", async () => {
  const [error, result] = await mightFail(Promise.reject(undefined));
  expect(result).toBe(undefined);
  expect(error?.message).toBeTruthy();
});

test("fail with string returns an error with that string as the message", async () => {
  const [error, result] = await mightFail(Promise.reject("error"));
  expect(result).toBe(undefined);
  expect(error?.message).toBe("error");
});

test("fail with object returns an error with that object as the message", async () => {
  const [error, result] = await mightFail(Promise.reject({ message: "error" }));
  expect(result).toBe(undefined);
  expect(error?.message).toBe("error");
});

test("async function that throws", async () => {
  const asyncFn = async () => {
    throw new Error("async error");
  };
  const [error, result] = await mightFail(asyncFn());
  expect(result).toBe(undefined);
  expect(error?.message).toBe("async error");
});

test("promise that resolves after delay", async () => {
  const delayedPromise = new Promise((resolve) =>
    setTimeout(() => resolve("delayed success"), 100)
  );
  const [error, result] = await mightFail(delayedPromise);
  expect(result).toBe("delayed success");
  expect(error).toBe(undefined);
});

test("promise that rejects after delay", async () => {
  const delayedPromise = new Promise((_, reject) =>
    setTimeout(() => reject("delayed error"), 100)
  );
  const [error, result] = await mightFail(delayedPromise);
  expect(result).toBe(undefined);
  expect(error?.message).toBe("delayed error");
});
