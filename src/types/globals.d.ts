import "vue";
import { type UseColorModeReturn } from "@vueuse/core";
import { type LucideIcon } from "@lucide/vue";

declare global {
  type MenuStyle = "TOP_BAR" | "BOTTOM_BAR";

  type PageObject = {
    id: string;
    href: string;
    icon: LucideIcon;
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
    };
  }
}

export {};
