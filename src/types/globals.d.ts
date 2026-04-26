import { type Ref, type Component } from "vue";
import { type UseColorModeReturn } from "@vueuse/core";
import { type LucideIcon } from "@lucide/vue";
import type { Component } from "vue";

declare global {
  type MenuStyle = "TOP_BAR" | "BOTTOM_BAR" | "LEFT_BAR";

  type PageObject = {
    id: string;
    href?: string;
    callback?: () => void;
    icon: LucideIcon;
  };

  type PopupContent = {
    title?: string;
    description?: string;
    component?: Component;
    statement?: string;
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
    $secret: {
      Encrypt: (jwt: JWTPayload, pin: string) => boolean;
      Decrypt: (secret: string) => Uint8Array | undefined;
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
      AddPopup: (
        content: PopupContent,
        component: Component,
        show: boolean,
      ) => void;
    };
  }
}

export {};
