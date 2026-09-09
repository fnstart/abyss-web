<script lang="ts" setup>
import { watch, ref, computed, type Ref } from "vue";
import { Save } from "lucide-vue-next";
import { CircleAlert, CircleCheck, Trash2 } from "@lucide/vue";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from "@/main/components/ui/input-group";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/main/components/ui/input-otp";
import { secret, main } from "@/scripts/composables";

type Stage = "INPUT_TOKEN" | "INPUT_PIN" | "DECRYPT_TOKEN";

const TOKEN_MODEL: Ref<string> = ref(crypto.randomUUID());
const PIN_MODEL = ref("");
const PAGE: Ref<Stage> = ref("INPUT_TOKEN");
const ERROR = ref("");
const SAVED = ref(secret.HasToken.value());

const DESCRIPTIONS: Record<Stage, string> = {
    INPUT_TOKEN:
        "Input your Private Abyss Login Token, to save this for future events.",
    INPUT_PIN:
        "Encrypt your PALT (Private Abyss Login Token) with a pin code.",
    DECRYPT_TOKEN:
        "Decrypt and validate the Local Token with your pin code to finalize.",
};

const locked = computed(() => secret.LockedFor.value() > 0);

watch(PAGE, (stage) => {
    ERROR.value = "";
    main.POPUP_CONTENT.value = {
        ...main.POPUP_CONTENT.value,
        description: DESCRIPTIONS[stage],
    };
});

/** Wipe the stored token so a different one can be saved on this device. */
const forget = () => {
    secret.Forget.value();
    SAVED.value = false;
    TOKEN_MODEL.value = crypto.randomUUID();
    PIN_MODEL.value = "";
    ERROR.value = "";
    PAGE.value = "INPUT_TOKEN";
};

watch(PIN_MODEL, async (data) => {
    if (data.length !== 6) return;

    if (PAGE.value === "INPUT_PIN") {
        await secret.Encrypt.value(
            {
                token: TOKEN_MODEL.value,
                date: Date.now(),
            },
            data,
        );

        SAVED.value = true;
        PIN_MODEL.value = "";
        PAGE.value = "DECRYPT_TOKEN";
        return;
    }

    if (PAGE.value !== "DECRYPT_TOKEN") return;

    const unlocked = await secret.Unlock.value(data);

    if (unlocked.ok) {
        main.SHOW_POPUP.value = false;
        return;
    }

    PIN_MODEL.value = "";

    switch (unlocked.reason) {
        case "locked":
            ERROR.value = `Too many wrong PINs. Try again in ${Math.ceil(unlocked.retryIn / 1000)}s.`;
            return;
        case "wrong_pin":
            ERROR.value =
                secret.LockedFor.value() > 0
                    ? `Too many wrong PINs. Try again in ${secret.LockedFor.value()}s.`
                    : `That PIN did not match the one you just set (attempt ${unlocked.attempts}).`;
            return;
        case "malformed":
            ERROR.value =
                "The token was saved in a shape the app does not understand. Start again.";
            return;
        case "no_token":
            ERROR.value = "Nothing is saved on this device. Start again.";
            PAGE.value = "INPUT_TOKEN";
            return;
    }
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <div
            v-if="SAVED && PAGE === 'INPUT_TOKEN'"
            class="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/45"
        >
            <CircleCheck class="size-4 shrink-0 text-green-400" />
            <p class="text-sm opacity-80">
                A token is already saved on this device. Saving a new one
                replaces it.
            </p>
        </div>

        <div v-show="PAGE === 'INPUT_TOKEN'" class="flex flex-col gap-3">
            <InputGroup class="py-5 px-1">
                <InputGroupInput v-model="TOKEN_MODEL" placeholder="..." />
                <InputGroupAddon>
                    <InputGroupText>abyss://</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon class="p-2" align="inline-end">
                    <InputGroupButton
                        @click="() => (PAGE = 'INPUT_PIN')"
                        :disabled="!TOKEN_MODEL"
                        variant="outline"
                        size="icon-sm"
                    >
                        <Save class="size-4" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>

        <div
            v-show="PAGE === 'INPUT_PIN' || PAGE === 'DECRYPT_TOKEN'"
            class="flex flex-col gap-3 items-center"
        >
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
        </div>

        <div
            v-if="ERROR"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-destructive bg-destructive/15"
        >
            <CircleAlert class="size-4 shrink-0" />
            <p class="text-sm">{{ ERROR }}</p>
        </div>

        <div v-if="SAVED" class="flex justify-end">
            <div
                class="flex items-center gap-2 px-3 py-1 rounded-md text-destructive opacity-60 bg-destructive/15 hover:opacity-100 hover:bg-destructive/25 cursor-pointer select-none transition-all duration-300"
                @click="forget"
            >
                <Trash2 class="size-4" />
                <text class="text-sm">Forget token</text>
            </div>
        </div>
    </div>
</template>
