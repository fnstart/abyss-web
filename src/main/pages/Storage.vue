<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { Database, RefreshCw, Download } from "@lucide/vue";
import { Button } from "@/main/components/ui/button";

// $api is registered by src/scripts/composables (plan #1). Until that lands
// the page renders an "unavailable" state instead of crashing.
const api = getCurrentInstance()?.appContext.config.globalProperties.$api;

const items = ref<StorageItem[]>([]);
const cursor = ref<string | null | undefined>(undefined);
const loading = ref(false);
const error = ref<string | null>(null);

const load = async (next?: string) => {
    if (!api) {
        error.value = "Storage API is not available yet.";
        return;
    }
    loading.value = true;
    error.value = null;

    const result = await api.storage.list(next);
    if (result.ok) {
        items.value = next
            ? [...items.value, ...result.data.items]
            : result.data.items;
        cursor.value = result.data.cursor ?? null;
    } else {
        error.value = result.error.message;
    }
    loading.value = false;
};

const formatSize = (bytes?: number) => {
    if (bytes === undefined) return "";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

onMounted(() => load());
</script>

<template>
    <div class="flex flex-col w-full max-w-5xl gap-4 py-6 px-2">
        <header class="flex items-center gap-3">
            <Database class="size-5 opacity-70" />
            <h1 class="text-lg font-medium">Public Storage</h1>
            <Button
                variant="ghost"
                size="icon-sm"
                class="ml-auto"
                :disabled="loading"
                @click="load()"
            >
                <RefreshCw class="size-4" :class="loading && 'animate-spin'" />
            </Button>
        </header>

        <p
            v-if="error"
            class="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2"
        >
            {{ error }}
        </p>

        <p
            v-else-if="!loading && items.length === 0"
            class="text-sm text-muted-foreground"
        >
            Nothing has been shared yet.
        </p>

        <ul v-else class="flex flex-col divide-y rounded-md border">
            <li
                v-for="item in items"
                :key="item.id"
                class="flex items-center gap-3 px-3 py-2 text-sm"
            >
                <span class="truncate">{{ item.name }}</span>
                <span class="ml-auto text-xs text-muted-foreground">{{
                    formatSize(item.size)
                }}</span>
                <a
                    v-if="item.url"
                    :href="item.url"
                    class="opacity-60 hover:opacity-100 transition-opacity"
                    target="_blank"
                    rel="noopener"
                >
                    <Download class="size-4" />
                </a>
            </li>
        </ul>

        <Button
            v-if="cursor"
            variant="outline"
            size="sm"
            class="self-center"
            :disabled="loading"
            @click="load(cursor)"
        >
            Load more
        </Button>
    </div>
</template>
