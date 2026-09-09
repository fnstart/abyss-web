<script lang="ts" setup>
import { KeyRound, MessagesSquare, ShieldCheck } from "@lucide/vue";
import { main } from "@/scripts/composables";

// There is no payment backend, so this popup is deliberately a handoff rather
// than a checkout - it explains the flow and hands the user to Discord.
const STEPS = [
    {
        icon: MessagesSquare,
        text: "Ask in the Discord and pay a seller for a key.",
    },
    {
        icon: KeyRound,
        text: "You get a PALT - a Private Abyss Login Token.",
    },
    {
        icon: ShieldCheck,
        text: "Save it here under a 6-digit PIN. It never leaves this device unencrypted.",
    },
];

const openLogin = () =>
    main.AddPopup.value(
        {
            title: "Login",
            description:
                "Input your Private Abyss Login Token, to save this for future events.",
        },
        () => import("@/main/components/popup/Login.vue"),
        true,
    );
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
            <div
                v-for="(step, index) in STEPS"
                :key="step.text"
                class="flex items-start gap-3 px-3 py-2 rounded-md bg-accent/45"
            >
                <component :is="step.icon" class="size-4 mt-0.5 shrink-0 opacity-70" />
                <p class="text-sm opacity-80">
                    <text class="opacity-50">{{ index + 1 }}.</text>
                    {{ step.text }}
                </p>
            </div>
        </div>

        <a href="https://discord.gg/QWhrX3qYQx" target="_blank" rel="noreferrer">
            <div
                class="flex items-center justify-center p-2 rounded-md w-full h-10 bg-blue-400 border border-blue-300 text-secondary font-semibold select-none hover:bg-blue-500 cursor-pointer transition-colors duration-300"
            >
                Join the Discord!
            </div>
        </a>

        <div class="flex justify-center">
            <text
                class="text-sm opacity-50 hover:opacity-90 cursor-pointer select-none transition-opacity duration-300"
                @click="openLogin"
                >Already have a key? Save it here.</text
            >
        </div>
    </div>
</template>
