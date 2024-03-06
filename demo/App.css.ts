import { styled } from "../src";
import { theme } from "./theme.css.ts";

export const container = styled.css`
  font-size: ${theme.size(32)};
  background-color: ${theme.color.background};
`;
