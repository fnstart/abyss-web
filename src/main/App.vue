<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Just some extra precautions.
const Shell = defineAsyncComponent(() => import("./Shell.vue"));

// Yeah re-using just for a split second loading screen.
import Favicon from "@/assets/favicon.svg";
</script>

<template>
    <Suspense>
        <template #default>
            <Shell />
        </template>
        <template #fallback>
            <div class="flex min-w-full min-h-dvh items-center justify-center">
                <Favicon class="size-10" />
            </div>
        </template>
    </Suspense>
</template>
