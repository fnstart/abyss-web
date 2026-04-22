import {
  ref,
  type Ref,
  type Component,
  defineAsyncComponent,
  shallowRef,
} from "vue";

const SHOW_POPUP = ref(true);
const POPUP_CONTENT: Ref<PopupContent> = shallowRef({
  title: "Navigation Style",
  description: "Choose how you'd like the navigation to appear.",
  component: defineAsyncComponent(
    () => import("@/main/components/popup/ChooseBar.vue"),
  ),
});
const MENU_SETTING = ref(localStorage.getItem("MENU_SETTING") || "BOTTOM_BAR");

export const SetPopupRef = {
  value: (value: boolean) => {
    SHOW_POPUP.value = value;
  },
  index: "SetPopupRef",
};

export const GetPopupRef = {
  value: SHOW_POPUP,
  index: "GetPopupRef",
};

export const SetPopupContent = {
  value: (title: string, description: string, component: Component) => {
    POPUP_CONTENT.value = {
      title,
      description,
      component,
    };
    SHOW_POPUP.value = true;
  },
  index: "SetPopupContent",
};

export const GetPopupContent = {
  value: POPUP_CONTENT,
  index: "GetPopupContent",
};

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
  list: [
    SetMenuStyle,
    GetMenuStyle,
    SetPopupRef,
    GetPopupRef,
    SetPopupContent,
    GetPopupContent,
  ],
};

export default list;
