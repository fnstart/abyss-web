import * as theme from "./useTheme";
import * as home from "./useHome";

const compose = [theme.default, home.default];
export { home, theme, compose };
