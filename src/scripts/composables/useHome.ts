import {
  Bug,
  SquareChevronRight,
  Database,
  ScanSearch,
  PencilRuler,
  Pyramid,
  BookUser,
} from "@lucide/vue";
import api from "@/scripts/api";
import type { ApiError, ApiResult, DownloadLink } from "@/scripts/api";
import { main } from "@/scripts/composables";
import { Notify } from "./useNotice";
import { HasToken } from "./useSecret";

const openLogin = () =>
  main.AddPopup.value(
    {
      title: "Login",
      description:
        "Input your Private Abyss Login Token, to save this for future events.",
    },
    () => import("@/main/components/popup/Login.vue"),
    true,
  );

const openUnlock = () =>
  main.AddPopup.value(
    {
      title: "Update IP",
      description: "Decrypt your PALT to authenticate.",
    },
    () => import("@/main/components/popup/UpdateIP.vue"),
    true,
  );

/** Turn an ApiError into a popup that tells the user what to do next. */
const report = (title: string, error: ApiError) => {
  if (error.code === "unauthorized") {
    Notify.value(title, error.message, "error", {
      label: HasToken.value() ? "Unlock" : "Add a token",
      run: HasToken.value() ? openUnlock : openLogin,
    });
    return;
  }

  Notify.value(title, error.message, "error");
};

/** Every authenticated action funnels through here so the "no token yet" and
 *  "token locked" cases are answered once instead of in each callback. */
const authed = async <T>(
  title: string,
  call: () => Promise<ApiResult<T>>,
  onOk: (data: T) => void,
) => {
  if (!HasToken.value()) {
    Notify.value(
      title,
      "You have no Abyss token saved on this device yet.",
      "error",
      { label: "Add a token", run: openLogin },
    );
    return;
  }

  if (!api.hasToken()) {
    Notify.value(
      title,
      "Your token is still locked. Enter your PIN to unlock it for this session.",
      "info",
      { label: "Unlock", run: openUnlock },
    );
    return;
  }

  const result = await call();

  if (!result.ok) {
    report(title, result.error);
    return;
  }

  onOk(result.data);
};

const download = (title: string, link: DownloadLink) => {
  Notify.value(
    title,
    link.version
      ? `Version ${link.version} is ready. The download starts when you continue.`
      : "Your download is ready. It starts when you continue.",
    "success",
    { label: "Download", href: link.url },
  );
};

const Pages: PageObject[] = [
  {
    id: "Update IP",
    callback: openUnlock,
    icon: BookUser,
  },
  {
    id: "Download Injector",
    callback: () =>
      void authed("Download Injector", api.downloads.injector, (link) =>
        download("Download Injector", link),
      ),
    icon: Bug,
  },
  {
    id: "Download Console",
    callback: () =>
      void authed("Download Console", api.downloads.console, (link) =>
        download("Download Console", link),
      ),
    icon: SquareChevronRight,
  },
  {
    id: "Public Storage",
    route: "storage",
    icon: Database,
  },
  {
    id: "Avatar Search",
    route: "search",
    icon: ScanSearch,
  },
  {
    id: "Custom Client Editor",
    route: "editor",
    icon: PencilRuler,
  },
  {
    id: "Activate Custom Client",
    callback: () =>
      void authed("Activate Custom Client", api.client.activate, (result) =>
        Notify.value(
          "Activate Custom Client",
          result.activated
            ? result.expiresAt
              ? `Custom client active until ${new Date(result.expiresAt).toLocaleString()}.`
              : "Custom client is now active on your account."
            : "The server did not activate the custom client. Check your key.",
          result.activated ? "success" : "error",
        ),
      ),
    icon: Pyramid,
  },
];

export const pages = {
  value: Pages,
  index: "pages",
};

export const list = {
  index: "home",
  list: [pages],
};

export default list;
