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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/main/components/ui/dialog";
</script>

<template>
    <Dialog v-model:open="$main.GetPopupRef.value">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{
                    $main.GetPopupContent.value.title
                }}</DialogTitle>
                <DialogDescription>
                    {{ $main.GetPopupContent.value.description }}
                </DialogDescription>
                <div class="flex flex-col">
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
