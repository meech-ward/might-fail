# Might Fail

A TypeScript library for handling async errors without `try` and `catch` blocks. Inspired by other languages that utilize Result or Either types for safer error handling.

## Quick Start

### Install

```
npm install might-fail
```

### Wrap Promise in `mightFail`

```ts
const {error, result: posts} = await mightFail(fetch("/posts"))

if (error) {
  // handle error
  return 
}
posts!.map(post => console.log(post.title))
```

### Or Wrap Async Function in `makeMightFail`

```ts
const mfFetch = makeMightFail(fetch)
const {error, result: posts} = await mfFetch("/posts")

if (error) {
  // handle error
  return 
}
posts!.map(post => console.log(post.title))
```

---

## Either Type

`await`ing the `mightFail` functions will return an `Either` type with either an `error` or a `result`.

* `error` always has the type `Error | undefined`.
* `result` always has the type `T | undefined` where `T` is the type of the result of the promise passed to `mightFail`.

This means that the you never lose the type information of the result of the promise passed to `mightFail`.
