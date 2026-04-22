import {
  Bug,
  SquareChevronRight,
  Database,
  ScanSearch,
  PencilRuler,
  Pyramid,
  BookUser,
} from "@lucide/vue";

const Pages = [
  {
    id: "Update IP",
    href: "/?popup=update",
    icon: BookUser,
  },
  {
    id: "Download Injector",
    href: "/downloads?ref=injector",
    icon: Bug,
  },
  {
    id: "Download Console",
    href: "/downloads?ref=console",
    icon: SquareChevronRight,
  },
  {
    id: "Public Storage",
    href: "/storage",
    icon: Database,
  },
  {
    id: "Avatar Search",
    href: "/search",
    icon: ScanSearch,
  },
  {
    id: "Custom Client Editor",
    href: "/client?ref=editor",
    icon: PencilRuler,
  },
  {
    id: "Activate Custom Client",
    href: "/client?ref=activation",
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
