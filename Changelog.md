# Changelog

All notable changes to this project will be documented in this file.

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
