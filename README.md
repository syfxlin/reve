# Reve

[vanilla-extract](https://vanilla-extract.style) is a CSS-in-JS compiler that writes styles in TypeScript (or JavaScript) using locale-scoped class names and CSS variables, then generates static CSS files at build time.

@syfxlin/reve is a library of enhancements to vanilla-extract to improve the experience of using vanilla-extract and reduce unnecessary time consumption due to specific programming paradigms.

## Motivation

vanilla-extract use object style to define styles, which makes good use of the type mechanism for auto-completion and error checking. But this style is not convenient compared to vanilla style. For example, string values need more quotes, CSS functions can't be auto-complete and error-checked, [Emmet](https://docs.emmet.io/css-abbreviations) abbreviation syntax is not supported, and so on.

vanilla-extract each style block can only target a single element, which makes it a pain when we need to define complex nested styles, wasting a lot of time writing global styles or adding classNames to child elements, most typically adding typography styles. The most typical scenario is to add typography styles. For example, here's a comparison of two snippets:

```typescript
// Bad
export const typography = style({
  // ...
});

globalStyle(`${typography} h1, ${typography} h2, ${typography} h3`, {
  // ...
});

globalStyle(`${typography} h1::before, ${typography} h2::before, ${typography} h3::before`, {
  // ...
});

// Good
export const typography = styled.css`
  // ... typography style
  
  h1, h2, h3 {
    // ... heading style
    
    &::after {
      // ... heading ::after pseudo style
    }
  }
`
```

vanilla-extract developers added this limitation for maintainability, so I don't think they'll remove it, so I use the [stylis](https://github.com/thysultan/stylis) library to parse the vanilla style css into object style css and chunking the styles to ensure that a style chunk targets only and chunking the styles to make sure that a style block is only for one element, styles is finally exported via vanilla-extract globalStyle.

vanilla-extract writes styles based on TypeScript/JavaScript, so it has the ability to execute code, and we can take advantage of this by creating a theme system that calculates values at build time and hardcodes them directly into the CSS, defining only the values that need to be able to change dynamically in theme variables. This way we don't need to define a very large number of theme variables, resulting in a very large CSS file (vanilla-extract generates all defined theme variables into the final CSS file, even if it doesn't use them). For example:

```typescript
// Bad
export const theme = createThemeContract({
  color: {
    background: null
  },
  size: {
    // ... x1 - x31
    x32: null
  }
});

createGlobalTheme(".light-theme", theme, {
  color: {
    background: "lightblue"
  },
  size: {
    // ... x1 - x31
    x32: "32px"
  }
});

createGlobalTheme(".dark-theme", theme, {
  color: {
    background: "lightpink"
  },
  size: {
    // ... x1 - x31
    x32: "32px"
  }
});

export const container = styled.css`
  font-size: ${theme.size.x32};
  background-color: ${theme.color.background};
`;
// Output:
// .light-theme { --def456: lightblue; /* x1-x31 */; --x32: 32px; }
// .dark-theme { --def456: lightpink; /* x1-x31 */; --x32: 32px; }
// .abc123 { font-size: var(--x32); background-color: var(--def456); }

// Good
export const theme = createReveTheme({
  static: {
    size: (value: number) => `${value}px`,
  },
  dynamic: {
    ".light-theme": {
      color: { background: "lightblue" },
    },
    ".dark-theme": {
      color: { background: "lightpink" },
    },
  },
});

export const container = styled.css`
  font-size: ${theme.size(32)};
  background-color: ${theme.color.background};
`;
// Output:
// .light-theme { --def456: lightblue; }
// .dark-theme { --def456: lightpink; }
// .abc123 { font-size: 32px; background-color: var(--def456); }
```

I started this project as a proof-of-concept to see if I could fix a few of the bad implementations mentioned above, improve my coding efficiency, and save time for other things I want to do.

## Installation

```shell
# NPM
npm i @syfxlin/reve @vanilla-extract/css
# Yarn
yarn add @syfxlin/reve @vanilla-extract/css
# PNPM
pnpm add @syfxlin/reve @vanilla-extract/css
```

## Usage

```typescript
import { styled, createReveTheme } from "@syfxlin/reve";

// vanilla css api
styled.global`
  box-sizing: border-box;
`

export const container = styled.css`
  font-size: ${theme.size(32)};
  background-color: ${theme.color.background};

  /* Supports nested syntax for styled-componets styles */
  div {
    display: flex;

    &::before {
    }
  }

  div & {
  }

  & div {
  }

  & > div {
  }

  /* Support media query syntax */
  @media (max-width: 1250px) {
    /* ... */
  }
`;

// theme system
export const theme = createReveTheme({
  static: {
    size: (value: number) => `${value}px`,
  },
  dynamic: {
    ".light-theme": {
      color: { background: "lightblue" },
    },
    ".dark-theme": {
      color: { background: "lightpink" },
    },
  },
});
```

## Maintainer

**@syfxlin/reve** is written and maintained with the help of [Otstar Lin](https://github.com/syfxlin) and the following [contributors](https://github.com/syfxlin/reve/graphs/contributors).

## License

Released under the [MIT](https://opensource.org/licenses/MIT) License.
