import { expect, test } from "vitest";
import { mightFailSync } from "../../src/go/index";

function somethingThatThrows(input: string) {
  if (!input) {
    throw new Error("error");
  }
  return { message: input };
}

test("success returns the response", async () => {
  const [result, error] = mightFailSync(() => somethingThatThrows("success"));
  expect(error).toBe(undefined);
  expect(result?.message).toBe("success");
});

test("fail with error returns the error", async () => {
  const [result, error] = mightFailSync(() => somethingThatThrows(""));
  expect(result).toBe(undefined);
  expect(error?.message).toBe("error");
});

test("fail without error returns an error", async () => {
  const [result, error] = await mightFailSync(() => {
    throw "a fit";
  });
  expect(result).toBe(undefined);
  expect(error?.message).toBeTruthy();
});

test("fail with string returns an error with that string as the message", async () => {
  const [result, error] = await mightFailSync(() => {
    throw "a fit";
  });
  expect(result).toBe(undefined);
  expect(error?.message).toBe("a fit");
});
