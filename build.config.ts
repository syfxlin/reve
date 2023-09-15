import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index.ts"],
  externals: ["react"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
