<script lang="ts" setup>
import { watch, ref, computed, type Ref } from "vue";
import { CircleAlert, CircleCheck, LoaderCircle } from "@lucide/vue";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/main/components/ui/input-otp";
import { secret, main } from "@/scripts/composables";
import api from "@/scripts/api";

type Stage = "PIN_LOGIN" | "WORKING" | "DONE";

const PIN_MODEL = ref("");
const PAGE: Ref<Stage> = ref("PIN_LOGIN");
const ERROR = ref("");
const RESULT_IP = ref("");

const DESCRIPTIONS: Record<Stage, string> = {
    PIN_LOGIN: "Decrypt your PALT to authenticate.",
    WORKING: "Talking to the server...",
    DONE: "Your account IP is up to date.",
};

const locked = computed(() => secret.LockedFor.value() > 0);

const describe = (text: string) => {
    main.POPUP_CONTENT.value = {
        ...main.POPUP_CONTENT.value,
        description: text,
    };
};

watch(PAGE, (stage) => describe(DESCRIPTIONS[stage]));

/** Wrong PIN / lockout wording, kept in one place. */
const reject = (message: string) => {
    ERROR.value = message;
    PIN_MODEL.value = "";
    PAGE.value = "PIN_LOGIN";
};

watch(PIN_MODEL, async (data) => {
    if (data.length !== 6 || PAGE.value !== "PIN_LOGIN") return;

    ERROR.value = "";

    const unlocked = await secret.Unlock.value(data);

    if (!unlocked.ok) {
        switch (unlocked.reason) {
            case "no_token":
                reject("No token is saved on this device. Log in first.");
                return;
            case "malformed":
                reject("The saved token is unreadable. Log in again to replace it.");
                return;
            case "locked":
                reject(
                    `Too many wrong PINs. Try again in ${Math.ceil(unlocked.retryIn / 1000)}s.`,
                );
                return;
            case "wrong_pin":
                reject(
                    secret.LockedFor.value() > 0
                        ? `Too many wrong PINs. Try again in ${secret.LockedFor.value()}s.`
                        : "That PIN did not open your token.",
                );
                return;
        }
    }

    PAGE.value = "WORKING";

    const updated = await api.updateIP();

    if (!updated.ok) {
        PIN_MODEL.value = "";
        ERROR.value = updated.error.message;
        PAGE.value = "PIN_LOGIN";
        return;
    }

    RESULT_IP.value = updated.data.ip;
    PAGE.value = "DONE";
});
</script>

<template>
    <div v-show="PAGE === 'PIN_LOGIN'" class="flex flex-col gap-3 items-center">
        <InputOTP v-model="PIN_MODEL" :maxlength="6" :disabled="locked">
            <InputOTPGroup>
                <InputOTPSlot :index="0" />
                <InputOTPSlot :index="1" />
                <InputOTPSlot :index="2" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot :index="3" />
                <InputOTPSlot :index="4" />
                <InputOTPSlot :index="5" />
            </InputOTPGroup>
        </InputOTP>
        <div
            v-if="ERROR"
            class="flex items-center gap-2 px-3 py-2 w-full rounded-md text-destructive bg-destructive/15"
        >
            <CircleAlert class="size-4 shrink-0" />
            <p class="text-sm">{{ ERROR }}</p>
        </div>
    </div>

    <div
        v-show="PAGE === 'WORKING'"
        class="flex items-center justify-center gap-2 py-6 opacity-70"
    >
        <LoaderCircle class="size-4 animate-spin" />
        <text class="text-sm">Updating your IP...</text>
    </div>

    <div v-show="PAGE === 'DONE'" class="flex flex-col gap-3">
        <div
            class="flex items-center gap-2 px-3 py-2 rounded-md text-green-400 bg-green-400/15"
        >
            <CircleCheck class="size-4 shrink-0" />
            <p class="text-sm">Your account now points at {{ RESULT_IP }}.</p>
        </div>
        <div class="flex justify-end">
            <div
                class="flex items-center justify-center px-4 py-1 rounded-md bg-accent/50 hover:bg-accent border border-bg-accent cursor-pointer select-none transition-colors duration-300"
                @click="main.SHOW_POPUP.value = false"
            >
                <text>Close</text>
            </div>
        </div>
    </div>
</template>
