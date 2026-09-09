<script lang="ts" setup>
import { getCurrentInstance, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { ScanSearch } from "@lucide/vue";
import { Input } from "@/main/components/ui/input";

const api = getCurrentInstance()?.appContext.config.globalProperties.$api;

const query = ref("");
const results = ref<AvatarResult[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searched = ref(false);

const search = useDebounceFn(async (q: string) => {
    if (!q.trim()) {
        results.value = [];
        searched.value = false;
        return;
    }
    if (!api) {
        error.value = "Search API is not available yet.";
        return;
    }
    loading.value = true;
    error.value = null;

    const result = await api.avatars.search(q.trim());
    if (result.ok) {
        results.value = result.data;
    } else {
        error.value = result.error.message;
    }
    searched.value = true;
    loading.value = false;
}, 250);

watch(query, (q) => search(q));
</script>

<template>
    <div class="flex flex-col w-full max-w-5xl gap-4 py-6 px-2">
        <header class="flex items-center gap-3">
            <ScanSearch class="size-5 opacity-70" />
            <h1 class="text-lg font-medium">Avatar Search</h1>
        </header>

        <Input
            v-model="query"
            placeholder="Search avatars by name"
            autofocus
        />

        <p
            v-if="error"
            class="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2"
        >
            {{ error }}
        </p>

        <p v-else-if="loading" class="text-sm text-muted-foreground">
            Searching…
        </p>

        <p
            v-else-if="searched && results.length === 0"
            class="text-sm text-muted-foreground"
        >
            No avatars match "{{ query }}".
        </p>

        <ul
            v-else-if="results.length"
            class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
            <li
                v-for="avatar in results"
                :key="avatar.id"
                class="flex items-center gap-3 rounded-md border bg-card/60 px-3 py-2 text-sm"
            >
                <img
                    v-if="avatar.thumbnail"
                    :src="avatar.thumbnail"
                    :alt="avatar.name"
                    class="size-8 rounded-sm object-cover"
                />
                <div
                    v-else
                    class="size-8 rounded-sm bg-accent"
                    aria-hidden="true"
                />
                <span class="truncate">{{ avatar.name }}</span>
            </li>
        </ul>
    </div>
</template>
