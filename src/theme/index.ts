import { createGlobalTheme, createThemeContract } from "@vanilla-extract/css";

export type StaticTokens<K extends string = string> = {
  [key in K]: string | StaticTokens<K> | ((...args: any[]) => string);
};

export type DynamicTokens<K extends string = string> = {
  [key in K]: string | DynamicTokens<K>;
};

export type ReveTheme<C extends ReveThemeContract = ReveThemeContract> = C["static"] & C["dynamic"][keyof C["dynamic"]];

export interface ReveThemeContract<S extends StaticTokens = StaticTokens, D extends DynamicTokens = DynamicTokens> {
  static: S;
  dynamic: Record<string, D>;
}

export function createReveTheme<T extends ReveThemeContract = ReveThemeContract>(tokens: T): ReveTheme<T> {
  const entries = Object.entries(tokens.dynamic);
  if (entries.length) {
    const contract = createThemeContract(entries[0][1]);
    for (const [selector, values] of entries) {
      // @ts-expect-error
      createGlobalTheme(selector, contract, values);
    }
    return { ...tokens.static, ...contract } as ReveTheme<T>;
  } else {
    return { ...tokens.static } as ReveTheme<T>;
  }
}
