<script lang="ts" setup>
import { watch, ref, type Ref } from "vue";
import { Save } from "lucide-vue-next";
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

const TOKEN_MODEL = ref(crypto.randomUUID());
const PIN_MODEL = ref("");
const PAGE: Ref<"INPUT_TOKEN" | "INPUT_PIN" | "DECRYPT_TOKEN"> =
    ref("INPUT_TOKEN");

watch(PAGE, (data) => {
    switch (data) {
        case "INPUT_TOKEN":
            main.POPUP_CONTENT.value = {
                ...main.POPUP_CONTENT.value,
                description:
                    "Input your Private Abyss Login Token, to save this for future events.",
            };
            return;
        case "INPUT_PIN":
            main.POPUP_CONTENT.value = {
                ...main.POPUP_CONTENT.value,
                description:
                    "Encrypt your PALT (Private Abyss Login Token) with a pin code.",
            };
            return;
        case "DECRYPT_TOKEN":
            main.POPUP_CONTENT.value = {
                ...main.POPUP_CONTENT.value,
                description:
                    "Decrypt and validate the Local Token with your pin code to finalize.",
            };
            return;
    }
});

watch(PIN_MODEL, async (data) => {
    if (data.length === 6) {
        if (PAGE.value === "INPUT_PIN") {
            const validated = await secret.Encrypt.value(
                {
                    token: TOKEN_MODEL.value,
                    date: Date.now(),
                },
                data,
            );
            console.log(validated);

            PIN_MODEL.value = "";
            PAGE.value = "DECRYPT_TOKEN";
        } else if (PAGE.value === "DECRYPT_TOKEN") {
            try {
                await secret.Decrypt.value(data);
                main.SHOW_POPUP.value = false;
            } catch {
                PIN_MODEL.value = "";
                TOKEN_MODEL.value = "";
                PAGE.value = "INPUT_TOKEN";
            }
        }
    }
});
</script>

<template>
    <div v-show="PAGE === 'INPUT_TOKEN'" class="flex flex-col gap-3">
        <InputGroup class="py-5 px-1">
            <InputGroupInput
                v-model="TOKEN_MODEL"
                placeholder="..."
                class="!pl-1"
            />
            <InputGroupAddon>
                <InputGroupText>abyss://</InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon class="p-2" align="inline-end">
                <InputGroupButton
                    @click="() => (PAGE = 'INPUT_PIN')"
                    variant="outline"
                    size="icon-sm"
                >
                    <Save class="size-4" />
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    </div>
    <div v-show="PAGE === 'INPUT_PIN'" class="flex flex-col gap-3 items-center">
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
    <div
        v-show="PAGE === 'DECRYPT_TOKEN'"
        class="flex flex-col gap-3 items-center"
    >
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
