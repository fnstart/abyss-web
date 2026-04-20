import { useColorMode } from "@vueuse/core";

export const colorMode = useColorMode({
  attribute: "class",
  modes: {
    dark: "dark",
    light: "",
  },
});

export const toggle = {
  value: () => {
    colorMode.value = colorMode.value === "dark" ? "light" : "dark";
  },
  index: "toggle",
};

export const mode = {
  value: colorMode,
  index: "mode",
};

export const list = {
  index: "theme",
  list: [toggle, mode],
};

export default list;
