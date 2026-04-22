<script lang="ts" setup>
import { Moon, Sun } from "@lucide/vue";
</script>

<template>
    <div
        class="flex overflow-hidden w-9 h-9 fixed bottom-4 right-4 z-150 [&_svg]:size-5 opacity-30 hover:opacity-100 hover:bg-card rounded-md transition-colors transition-opacity duration-300 cursor-pointer"
        @click="$theme.toggle"
    >
        <div class="flex relative w-full h-full items-center justify-center">
            <Transition
                enter-from-class="opacity-0 translate-y-3"
                enter-active-class="transition duration-300 ease-out"
                leave-to-class="opacity-0 -translate-y-3"
                leave-active-class="transition duration-300 ease-in"
                mode="out-in"
            >
                <Moon v-if="$theme.mode.value === 'dark'" key="moon" />
                <Sun v-else key="sun" />
            </Transition>
        </div>
    </div>
</template>
