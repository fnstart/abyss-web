import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationRaw,
} from "vue-router";
import HomePage from "@/main/pages/Home.vue";

/** Route names shared with useHome.ts entries ({ route: RouteName }). */
export type RouteName = "home" | "storage" | "search" | "editor";

const LEGACY_PAGES: Record<string, RouteName> = {
  storage: "storage",
  search: "search",
  editor: "editor",
};

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: HomePage },
  {
    path: "/storage",
    name: "storage",
    component: () => import("@/main/pages/Storage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/main/pages/Search.vue"),
  },
  {
    path: "/editor",
    name: "editor",
    component: () => import("@/main/pages/Editor.vue"),
  },
  // Anything unknown lands on home instead of a blank view.
  { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Old links used /?page=storage|search|editor. Map them onto the named routes
// and strip the query so the URL bar shows the real path.
router.beforeEach((to): RouteLocationRaw | undefined => {
  const page = to.query.page;
  if (typeof page !== "string") return undefined;

  const target = LEGACY_PAGES[page];
  const { page: _drop, ...query } = to.query;
  void _drop;

  return target ? { name: target, query } : { name: "home", query };
});

export default router;
