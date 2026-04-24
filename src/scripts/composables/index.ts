import * as theme from "./useTheme";
import * as home from "./useHome";
import * as main from "./useDefault";
import * as secret from "./useSecret";

const compose = [theme.default, home.default, main.default, secret.default];
export { main, home, theme, compose, secret };
