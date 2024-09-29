# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2024-09-29

### Added
- `/go` folder for a Go-style tuple implementation. `const [result, error] = mightFail(promise)`
- `/tuple` folder for a tuple implementation. `const [error, result] = mightFail(promise)`

### Changed
- If a function throws a string, the string will be the message of the new Error object.
- If a function throws an object with a message property, the message will be the message of the new Error object.
- If a function throws an object it will be passed to the Error object constructor as is.

## [0.3.0] - 2024-03-16

### Added
- Support for synchronous error handling with `mightFailSync` and `makeMightFailSync` functions.
- A new `publish` script in `package.json` to streamline the build and publish process.

### Changed
- The library now officially supports both async and sync error handling. This change is reflected in the README to emphasize the library's versatility in handling errors in different contexts.
- Updated `Either.ts` to streamline the type definition for a more straightforward implementation.

## [0.1] - [0.2]


### Added
- Initial support for async error handling with `mightFail` and `makeMightFail` functions.
- Comprehensive documentation in the README, illustrating the use of the library with practical examples.
- Implementation of the `Either` type to support the async error handling pattern.

### Changed
- Various internal improvements for better performance and reliability.
