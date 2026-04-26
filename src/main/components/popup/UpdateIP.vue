<script lang="ts" setup>
import { watch, ref, type Ref } from "vue";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/main/components/ui/input-otp";
import { secret, main } from "@/scripts/composables";

const PIN_MODEL = ref("");
const PAGE: Ref<"PIN_LOGIN"> = ref("PIN_LOGIN");

watch(PAGE, (data) => {
    switch (data) {
        case "PIN_LOGIN":
            main.POPUP_CONTENT.value = {
                ...main.POPUP_CONTENT.value,
                description: "Decrypt your PALT to authenticate.",
            };
            return;
    }
});

watch(PIN_MODEL, async (data) => {
    if (data.length === 6) {
        if (PAGE.value === "PIN_LOGIN") {
            try {
                await secret.Decrypt.value(data); // Use data from here to authenticate with the server.
                main.SHOW_POPUP.value = false;
                // Add anything here to update their IP.
            } catch {
                PIN_MODEL.value = "";
                // Fallback if authentication fails cause of user error.
            }
        }
    }
});
</script>

<template>
    <div v-show="PAGE === 'PIN_LOGIN'" class="flex flex-col gap-3 items-center">
        <InputOTP v-model="PIN_MODEL" :maxlength="6">
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
</template>
