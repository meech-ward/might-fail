import { makeMightFail } from "../src/makeMightFail";

const resolve = (value: { message: string }) => Promise.resolve(value);
async function main() {
  const func = makeMightFail(resolve);
  const { error, result } = await func({ message: "success" });
  if (error) {
    console.error(error);
    return;
  }
  console.log(result.message);
}

main();
