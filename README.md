# Reve

## Introduction

Provides css-prop-like API and flexible theme system based on vanilla-extract and stylis.

## Installation

```shell
npm i @syfxlin/reve @vanilla-extract/css
```

## Usage

```typescript
// css-prop-like API
styled.global`
  box-sizing: border-box;
`

export const container = styled.css`
  font-size: ${theme.size(32)};
  background-color: ${theme.color.background};
  
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
`;

// theme API
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

reve is written and maintained with the help of [Otstar Lin](https://ixk.me) and the following [contributors](https://github.com/syfxlin/reve/graphs/contributors).

> Otstar Lin - [Personal Website](https://ixk.me/) · [Blog](https://blog.ixk.me/) · [GitHub](https://github.com/syfxlin)

## License

![License](https://img.shields.io/github/license/syfxlin/reve.svg?style=flat-square)

Released under the Apache License 2.0.
