import { CSSProperties } from "react";

export function sx(...values: Array<CSSProperties | Record<string, any> | boolean | null | undefined>) {
  let results: CSSProperties = {};
  for (const value of values) {
    if (value === null || value === undefined || typeof value === "boolean") {
      continue;
    }
    results = { ...results, ...value };
  }
  return results;
}
