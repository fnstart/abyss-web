import { type Ref, type Component } from "vue";
import { type UseColorModeReturn } from "@vueuse/core";
import { type LucideIcon } from "@lucide/vue";
import type { Component } from "vue";

declare global {
  type MenuStyle = "TOP_BAR" | "BOTTOM_BAR";

  type PageObject = {
    id: string;
    href: string;
    icon: LucideIcon;
  };

  type PopupContent = {
    title: string | undefined;
    description: string | undefined;
    component: Component | undefined;
  };
}

declare module "vue" {
  interface ComponentCustomProperties {
    $theme: {
      toggle: () => void;
      mode: UseColorModeReturn;
    };
    $home: {
      pages: PageObject[];
    };
    $main: {
      SetMenuStyle: (value: MenuStyle) => void;
      GetMenuStyle: () => MenuStyle;
      SetPopupRef: (value: boolean) => void;
      GetPopupRef: Ref<boolean>;
      SetPopupContent: (
        title: string,
        description: string,
        component: Component,
      ) => void;
      GetPopupContent: Ref<PopupContent>;
    };
  }
}

export {};
