import * as theme from "./useTheme";
import * as home from "./useHome";
import * as main from "./useDefault";

const compose = [theme.default, home.default, main.default];
export { main, home, theme, compose };
