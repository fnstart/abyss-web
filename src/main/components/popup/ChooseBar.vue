<template>
    <div class="flex flex-row gap-2">
        <div
            class="flex flex-1 flex-col h-30 items-center bg-foreground/10 rounded-md relative border hover:bg-foreground/15 cursor-pointer transition-all duration-300"
            :class="{
                'border-foreground/60 bg-foreground/20':
                    $main.GetMenuStyle() === 'TOP_BAR',
            }"
            @click="$main.SetMenuStyle('TOP_BAR')"
        >
            <div class="flex justify-between w-full h-5 bg-foreground/10 p-1">
                <div v-for="_ in 3" class="w-15 h-full bg-foreground/15" />
            </div>
            <div class="flex flex-col w-full h-full p-2 gap-1">
                <div class="w-[80%] h-1 bg-foreground/15" />
                <div class="w-[50%] h-1 bg-foreground/15" />
            </div>
        </div>
        <div
            class="flex flex-1 flex-col h-30 items-center bg-foreground/10 rounded-md relative border hover:bg-foreground/15 cursor-pointer transition-all duration-300"
            :class="{
                'border-foreground/60 bg-foreground/20':
                    $main.GetMenuStyle() === 'BOTTOM_BAR',
            }"
            @click="$main.SetMenuStyle('BOTTOM_BAR')"
        >
            <div class="flex flex-col w-full h-full p-2 gap-1">
                <div class="w-[80%] h-1 bg-foreground/15" />
                <div class="w-[50%] h-1 bg-foreground/15" />
            </div>
            <div
                class="flex flex-row gap-3 h-4 w-fit min-w-10 my-auto mx-2 mb-2"
            >
                <div class="w-5 h-full bg-foreground/15" />
                <div class="w-15 h-full bg-foreground/15" />
                <div class="w-5 h-full bg-foreground/15" />
            </div>
        </div>
    </div>
</template>
