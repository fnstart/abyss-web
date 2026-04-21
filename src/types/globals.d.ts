import "vue";
import { type UseColorModeReturn } from "@vueuse/core";
import { type LucideIcon } from "@lucide/vue";

type PageObject = {
  id: string;
  href: string;
  icon: LucideIcon;
};

declare module "vue" {
  interface ComponentCustomProperties {
    $theme: {
      toggle: () => void;
      mode: UseColorModeReturn;
    };
    $home: {
      pages: PageObject[];
    };
  }
}

export {};
