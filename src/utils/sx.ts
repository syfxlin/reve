import { CSSProperties } from "react";
import { assignInlineVars } from "@vanilla-extract/dynamic";

export function sx(
  ...values: Array<
    CSSProperties | Record<string, any> | boolean | null | undefined
  >
) {
  let results: CSSProperties = {};
  for (const value of values) {
    if (value === null || value === undefined || typeof value === "boolean") {
      continue;
    }
    // @ts-expect-error
    results = { ...results, ...assignInlineVars(value) };
  }
  return results;
}
