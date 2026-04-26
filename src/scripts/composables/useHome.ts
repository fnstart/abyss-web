import {
  Bug,
  SquareChevronRight,
  Database,
  ScanSearch,
  PencilRuler,
  Pyramid,
  BookUser,
} from "@lucide/vue";
import { main } from "@/scripts/composables";

const Pages = [
  {
    id: "Update IP",
    callback: () =>
      main.AddPopup.value(
        {
          title: "Update IP",
          description: "Decrypt your PALT to authenticate.",
        },
        () => import("@/main/components/popup/UpdateIP.vue"),
        true,
      ),
    icon: BookUser,
  },
  {
    id: "Download Injector",
    callback: () => {},
    icon: Bug,
  },
  {
    id: "Download Console",
    callback: () => {},
    icon: SquareChevronRight,
  },
  {
    id: "Public Storage",
    href: "/?page=storage",
    icon: Database,
  },
  {
    id: "Avatar Search",
    href: "/?page=search",
    icon: ScanSearch,
  },
  {
    id: "Custom Client Editor",
    href: "/?page=editor",
    icon: PencilRuler,
  },
  {
    id: "Activate Custom Client",
    callback: () => {},
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
