<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Database, ScanSearch, PencilRuler, ArrowRight } from "@lucide/vue";
import Logo from "@/assets/logo.svg";

const router = useRouter();

const tiles: {
    route: RouteName;
    title: string;
    blurb: string;
    icon: typeof Database;
}[] = [
    {
        route: "storage",
        title: "Public Storage",
        blurb: "Browse and grab files shared with every Abyss user.",
        icon: Database,
    },
    {
        route: "search",
        title: "Avatar Search",
        blurb: "Look up avatars by name and jump straight to them.",
        icon: ScanSearch,
    },
    {
        route: "editor",
        title: "Custom Client Editor",
        blurb: "Tweak your client settings before you activate it.",
        icon: PencilRuler,
    },
];
</script>

<template>
    <div class="flex flex-col w-full max-w-5xl gap-6 py-6 px-2">
        <section class="flex flex-col items-center text-center gap-3 py-10">
            <Logo class="w-28 h-auto opacity-90" />
            <p class="text-muted-foreground max-w-xl text-sm">
                Your Abyss dashboard. Update your IP, fetch the latest
                downloads, and manage your custom client from one place.
            </p>
        </section>

        <section class="grid gap-3 sm:grid-cols-3">
            <button
                v-for="tile in tiles"
                :key="tile.route"
                type="button"
                class="group flex flex-col gap-3 p-4 text-left rounded-md border bg-card/60 hover:bg-accent transition-colors duration-300 cursor-pointer"
                @click="router.push({ name: tile.route })"
            >
                <component
                    :is="tile.icon"
                    class="size-5 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div class="flex flex-col gap-1">
                    <span class="font-medium">{{ tile.title }}</span>
                    <span class="text-xs text-muted-foreground">{{
                        tile.blurb
                    }}</span>
                </div>
                <span
                    class="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-70 transition-opacity mt-auto"
                >
                    Open <ArrowRight class="size-3" />
                </span>
            </button>
        </section>
    </div>
</template>
