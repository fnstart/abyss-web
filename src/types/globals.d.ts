import { type Ref, type Component } from "vue";
import { type UseColorModeReturn } from "@vueuse/core";
import { type LucideIcon } from "@lucide/vue";
import { type JWTPayload } from "jose";

declare global {
  type MenuStyle = "TOP_BAR" | "BOTTOM_BAR" | "LEFT_BAR";

  /** Named route, see src/scripts/router.ts. */
  type RouteName = "home" | "storage" | "search" | "editor";

  type PageObject = {
    id: string;
    /** Named route to push. Takes precedence over callback when set. */
    route?: RouteName;
    callback?: () => void;
    icon: LucideIcon;
  };

  type PopupContent = {
    title?: string;
    description?: string;
    component?: Component;
    statement?: string;
  };

  /** Contract with src/scripts/api (plan #1): never throws, branch on `ok`. */
  type ApiError = { code: string; message: string; status: number };
  type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

  type StorageItem = {
    id: string;
    name: string;
    size?: number;
    updatedAt?: string;
    url?: string;
  };

  type StoragePage = { items: StorageItem[]; cursor?: string | null };

  type AvatarResult = {
    id: string;
    name: string;
    thumbnail?: string;
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
      Encrypt: (jwt: JWTPayload, pin: string) => Promise<boolean>;
      Decrypt: (pin: string) => Promise<JWTPayload | null>;
    };
    $api: {
      request: <T>(path: string, init?: RequestInit) => Promise<ApiResult<T>>;
      get: <T>(path: string, init?: RequestInit) => Promise<ApiResult<T>>;
      post: <T>(
        path: string,
        body?: unknown,
        init?: RequestInit,
      ) => Promise<ApiResult<T>>;
      setToken: (token: string | null) => void;
      hasToken: () => boolean;
      updateIP: () => Promise<ApiResult<unknown>>;
      downloads: {
        injector: () => Promise<ApiResult<{ url: string }>>;
        console: () => Promise<ApiResult<{ url: string }>>;
      };
      client: {
        activate: () => Promise<ApiResult<unknown>>;
      };
      storage: {
        list: (cursor?: string) => Promise<ApiResult<StoragePage>>;
      };
      avatars: {
        search: (q: string) => Promise<ApiResult<AvatarResult[]>>;
      };
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
