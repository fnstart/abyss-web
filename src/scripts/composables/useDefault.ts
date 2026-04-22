import { ref } from "vue";

const MENU_SETTING = ref(localStorage.getItem("MENU_SETTING") || "BOTTOM_BAR");

export const GetMenuStyle = {
  value: () => {
    return MENU_SETTING.value;
  },
  index: "GetMenuStyle",
};

export const SetMenuStyle = {
  value: (value: MenuStyle) => {
    MENU_SETTING.value = value;
    localStorage.setItem("MENU_SETTING", MENU_SETTING.value);
  },
  index: "SetMenuStyle",
};

export const list = {
  index: "main",
  list: [SetMenuStyle, GetMenuStyle],
};

export default list;
