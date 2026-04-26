import {
  ref,
  defineAsyncComponent,
  shallowRef,
  watch,
  type Ref,
  type Component,
  type AsyncComponentLoader,
} from "vue";

export const SAVED_POPUP: Ref<PopupContent | null> = ref(null);
export const SHOW_POPUP = ref(false);
export const POPUP_CONTENT: Ref<PopupContent> = shallowRef({});
export const MENU_SETTING = ref(
  localStorage.getItem("MENU_SETTING") || "BOTTOM_BAR",
);

watch(SHOW_POPUP, (value: boolean) => {
  if (value) {
    const statementExists =
      POPUP_CONTENT.value.statement &&
      localStorage.getItem(POPUP_CONTENT.value.statement);

    if (statementExists) {
      SHOW_POPUP.value = false;
      POPUP_CONTENT.value = {};
    } else {
      SAVED_POPUP.value = POPUP_CONTENT.value;
    }
  } else {
    if (SAVED_POPUP.value && SAVED_POPUP.value.statement) {
      localStorage.setItem(SAVED_POPUP.value.statement, crypto.randomUUID());
    }
    SHOW_POPUP.value = false;
  }
});

export const AddPopup = {
  value: (
    content: PopupContent,
    component: AsyncComponentLoader,
    show: boolean,
  ) => {
    content.component = defineAsyncComponent(component);

    POPUP_CONTENT.value = content;

    if (show) {
      SHOW_POPUP.value = show;
    }
  },
  index: "AddPopup",
};

AddPopup.value(
  {
    title: "Navigation Style",
    description: "Choose how you'd like the navigation to appear.",
    statement: "NAV_STYLE_STATUS",
  },
  () => import("@/main/components/popup/ChooseBar.vue"),
  true,
);

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
    AddPopup,
  ],
};

export default list;
