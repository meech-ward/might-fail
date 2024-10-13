import { type Either } from "./Either"
import { mightFail, mightFailSync, Might, Fail } from "./mightFail"
import { makeMightFail, makeMightFailSync } from "./makeMightFail"

export { Either, mightFail, makeMightFail, mightFailSync, makeMightFailSync, Might, Fail }
const defaultExport = {
  mightFail,
  makeMightFail,
  mightFailSync,
  makeMightFailSync,
  Might,
  Fail
}
export default defaultExport
