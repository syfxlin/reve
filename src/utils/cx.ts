import { clsx } from "clsx";

export function cx(...values: Array<string | number | null | boolean | undefined>) {
  return clsx(...values);
}
