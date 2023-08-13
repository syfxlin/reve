import { compile, Element } from "stylis";
import { generateIdentifier, globalFontFace, globalKeyframes, globalStyle } from "@vanilla-extract/css";

const _template = (tpl: TemplateStringsArray, expr: Array<string | number | boolean | null | undefined>) => {
  let output = tpl[0];
  for (let i = 1; i < tpl.length; i++) {
    const value = expr[i - 1];
    output += typeof value === "string" || typeof value === "number" ? value : "";
    output += tpl[i];
  }
  return output;
};

const _property = (name: string) => {
  let value = "";
  let upper = false;
  for (let i = 0; i < name.length; i++) {
    const ch = name.charAt(i);
    if (ch === "-") {
      upper = true;
    } else {
      value += upper ? ch.toUpperCase() : ch.toLowerCase();
      upper = false;
    }
  }
  return value;
};

const _props = (element: Element): string => {
  return [element.props].flat().join(",");
};

const _styles = (element: Element | Element[]): any => {
  const elements = Array.isArray(element) ? element : element.children;
  if (typeof elements === "string") {
    return {};
  }
  const styles: any = {};
  for (const children of elements) {
    if (children.type !== "decl" || typeof children.props !== "string" || typeof children.children !== "string") {
      continue;
    }
    if (children.props.startsWith("--")) {
      styles.vars ??= {};
      styles.vars[children.props] = children.children;
    } else {
      const key = _property(children.props);
      if (Array.isArray(styles[key])) {
        styles[key] = [...styles[key], children.children];
      } else {
        styles[key] = children.children;
      }
    }
  }
  return styles;
};

const _compiled = (element: Element) => {
  // local
  if (element.type === "rule" && typeof element.children !== "string") {
    globalStyle(_props(element), _styles(element));
  }
  if (element.type === "@media" && typeof element.children !== "string") {
    for (const children of element.children) {
      globalStyle(_props(children), {
        "@media": { [_props(element)]: _styles(children) },
      });
    }
  }
  if (element.type === "@supports" && typeof element.children !== "string") {
    for (const children of element.children) {
      globalStyle(_props(children), {
        "@supports": { [_props(element)]: _styles(children) },
      });
    }
  }
  if (element.type === "@container" && typeof element.children !== "string") {
    for (const children of element.children) {
      globalStyle(_props(children), {
        "@container": { [_props(element)]: _styles(children) },
      });
    }
  }
  if (element.type === "@layer" && typeof element.children !== "string") {
    for (const children of element.children) {
      globalStyle(_props(children), {
        "@layer": { [_props(element)]: _styles(children) },
      });
    }
  }
  // global
  if (element.type === "@font-face" && typeof element.children !== "string") {
    globalFontFace(_props(element), _styles(element));
  }
  if (element.type === "@keyframes" && typeof element.children !== "string") {
    const keyframes: any = {};
    for (const children of element.children as Element[]) {
      keyframes[_props(children)] = _styles(children);
    }
    globalKeyframes(_props(element), keyframes);
  }
};

const css = (tpl: TemplateStringsArray, ...expr: Array<string | number | boolean | null | undefined>) => {
  const identifier = generateIdentifier();
  const elements = compile(`.${identifier} { ${_template(tpl, expr)} }`);
  for (const element of elements) {
    _compiled(element);
  }
  return identifier;
};

const global = (tpl: TemplateStringsArray, ...expr: Array<string | number | boolean | null | undefined>) => {
  const elements = compile(_template(tpl, expr));
  for (const element of elements) {
    _compiled(element);
  }
};

const fonts = (tpl: TemplateStringsArray, ...expr: Array<string | number | boolean | null | undefined>) => {
  const identifier = generateIdentifier();
  const elements = compile(_template(tpl, expr));
  const root = elements.find((e) => e.type === "@font-face");
  if (root) {
    globalFontFace(identifier, _styles(root));
  } else {
    globalFontFace(identifier, _styles(elements));
  }
  return identifier;
};

const keyframes = (tpl: TemplateStringsArray, ...expr: Array<string | number | boolean | null | undefined>) => {
  const identifier = generateIdentifier();
  const elements = compile(_template(tpl, expr));
  const root = elements.find((e) => e.type === "@keyframes");
  if (root) {
    const keyframes: any = {};
    for (const element of root.children as Element[]) {
      keyframes[_props(element)] = _styles(element);
    }
    globalKeyframes(identifier, keyframes);
  } else {
    const keyframes: any = {};
    for (const element of elements) {
      keyframes[_props(element)] = _styles(element);
    }
    globalKeyframes(identifier, keyframes);
  }
  return identifier;
};

export const styled = { css, global, fonts, keyframes };
