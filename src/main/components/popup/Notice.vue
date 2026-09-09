<script lang="ts" setup>
import { CircleAlert, CircleCheck, Info } from "@lucide/vue";
import { NOTICE } from "@/scripts/composables/useNotice";
import { main } from "@/scripts/composables";

const TONES = {
    info: { icon: Info, class: "text-foreground/70 bg-accent/45" },
    success: { icon: CircleCheck, class: "text-green-400 bg-green-400/15" },
    error: { icon: CircleAlert, class: "text-destructive bg-destructive/15" },
} as const;

const act = () => {
    const action = NOTICE.value.action;
    if (!action) return;

    if (action.run) action.run();
    if (action.href) window.location.assign(action.href);
    else main.SHOW_POPUP.value = false;
};
</script>

<template>
    <div class="flex flex-col gap-3">
        <div
            class="flex items-start gap-3 px-3 py-3 rounded-md"
            :class="TONES[NOTICE.tone].class"
        >
            <component :is="TONES[NOTICE.tone].icon" class="size-4 mt-0.5 shrink-0" />
            <p class="text-sm leading-relaxed">{{ NOTICE.body }}</p>
        </div>
        <div v-if="NOTICE.action" class="flex justify-end">
            <div
                class="flex items-center justify-center px-4 py-1 rounded-md bg-accent/50 hover:bg-accent border border-bg-accent cursor-pointer select-none transition-colors duration-300"
                @click="act"
            >
                <text>{{ NOTICE.action.label }}</text>
            </div>
        </div>
    </div>
</template>
