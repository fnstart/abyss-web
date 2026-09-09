import * as theme from "./useTheme";
import * as home from "./useHome";
import * as main from "./useDefault";
import * as secret from "./useSecret";
import * as notice from "./useNotice";
import * as api from "@/scripts/api";

// api's default export is the client itself (pages import it directly), so it
// registers through its named `list` rather than `.default` like the others.
const compose = [
  theme.default,
  home.default,
  main.default,
  secret.default,
  notice.default,
  api.list,
];

export { main, home, theme, compose, secret, notice, api };
