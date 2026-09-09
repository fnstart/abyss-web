<script lang="ts" setup>
import { ref, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { PencilRuler, RotateCcw } from "@lucide/vue";
import { Button } from "@/main/components/ui/button";
import { Textarea } from "@/main/components/ui/textarea";

const STORAGE_KEY = "CUSTOM_CLIENT_CONFIG";

// Draft lives in localStorage so it survives reloads; "Activate Custom
// Client" in the nav (useHome.ts) is what sends it to the server.
const config = useLocalStorage(STORAGE_KEY, "{\n  \n}");
const parseError = ref<string | null>(null);

const validate = (value: string) => {
    try {
        JSON.parse(value);
        parseError.value = null;
    } catch (e) {
        parseError.value = e instanceof Error ? e.message : "Invalid JSON";
    }
};

const reset = () => {
    config.value = "{\n  \n}";
};

watch(config, validate, { immediate: true });
</script>

<template>
    <div class="flex flex-col w-full max-w-5xl gap-4 py-6 px-2">
        <header class="flex items-center gap-3">
            <PencilRuler class="size-5 opacity-70" />
            <h1 class="text-lg font-medium">Custom Client Editor</h1>
            <Button
                variant="ghost"
                size="sm"
                class="ml-auto"
                @click="reset"
            >
                <RotateCcw class="size-4" /> Reset
            </Button>
        </header>

        <p class="text-sm text-muted-foreground">
            Edit your client configuration as JSON. It is saved locally as you
            type and applied when you activate the custom client from the menu.
        </p>

        <Textarea
            v-model="config"
            class="min-h-80 font-mono text-sm"
            spellcheck="false"
        />

        <p
            v-if="parseError"
            class="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2"
        >
            {{ parseError }}
        </p>
        <p v-else class="text-xs text-muted-foreground">Valid JSON.</p>
    </div>
</template>
