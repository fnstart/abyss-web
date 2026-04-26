<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Just some extra precautions.
const Shell = defineAsyncComponent(() => import("./Shell.vue"));

// Yeah re-using just for a split second loading screen.
import Favicon from "@/assets/favicon.svg";

// Popup Provider
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/main/components/ui/dialog";
</script>

<template>
    <Dialog v-model:open="$main.GetPopupRef.value">
        <DialogContent class="min-w-150">
            <DialogHeader>
                <DialogTitle v-show="$main.GetPopupContent.value.title">{{
                    $main.GetPopupContent.value.title
                }}</DialogTitle>
                <DialogDescription
                    v-show="$main.GetPopupContent.value.description"
                >
                    {{ $main.GetPopupContent.value.description }}
                </DialogDescription>
                <div class="flex flex-col px-3 py-3">
                    <component :is="$main.GetPopupContent.value.component" />
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>

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
