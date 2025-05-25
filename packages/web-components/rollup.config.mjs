import generateConfig from "@ak2021/rollup";
import pkg from "./package.json" with { type: "json" };

export default generateConfig({
  ...pkg,
  port: 3003,
});
