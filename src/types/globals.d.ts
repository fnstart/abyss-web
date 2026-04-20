import "vue";
import { type UseColorModeReturn } from "@vueuse/core";

declare module "vue" {
  interface ComponentCustomProperties {
    $theme: {
      toggle: () => void;
      mode: UseColorModeReturn;
    };
  }
}

export {};
