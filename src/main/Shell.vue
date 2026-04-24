<script setup lang="ts">
await document.fonts.ready;

import "@/css/vue/shell.css";
import ThemeToggle from "@/main/components/ThemeToggle.vue";
import { ScanQrCode, LayoutTemplate, LogIn, ShoppingBasket } from "@lucide/vue";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/main/components/ui/tooltip";
import HomePage from "./pages/Home.vue";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/main/components/ui/navigation-menu";
import Logo from "@/assets/logo.svg";
import Favicon from "@/assets/favicon.svg";
</script>

<template>
    <ThemeToggle />
    <TooltipProvider>
        <main
            class="flex flex-col w-full items-center h-screen max-h-screen p-2 bg-card"
        >
            <div
                class="flex pb-3 pt-1 px-2 w-full h-fit relative z-100"
                v-show="$main.GetMenuStyle() === 'TOP_BAR'"
            >
                <Logo class="w-18 h-auto mr-auto" />
                <div
                    class="flex flex-1 justify-center items-center absolute left-1/2 right-1/2"
                >
                    <NavigationMenu :viewport="false">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    class="opacity-50 hover:opacity-100 bg-transparent rounded-full select-none transition-all duration-300"
                                >
                                    <text>Menu</text>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div
                                        class="flex flex-col px-1 py-1 gap-1 w-100"
                                    >
                                        <div
                                            v-for="value in $home.pages"
                                            class="flex items-center justify-start px-2 py-1 gap-2 opacity-40 bg-accent/45 hover:opacity-100 hover:bg-accent rounded-md transition-all duration-300"
                                        >
                                            <component
                                                class="size-4"
                                                :is="value.icon"
                                            />
                                            <a :href="value.href">{{
                                                value.id
                                            }}</a>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    class="opacity-50 p-0 text-destructive hover:text-destructive hover:bg-destructive/25 hover:opacity-100 transition-all duration-300 rounded-md select-none cursor-pointer"
                                    @click="$main.SetMenuStyle('BOTTOM_BAR')"
                                >
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <div class="p-2">
                                                <ScanQrCode class="size-5" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Switch to bottom bar.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    :class="navigationMenuTriggerStyle()"
                                    class="opacity-50 bg-transparent hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer select-none"
                                >
                                    <a href="http://79.105.152.67:59345/"
                                        >Original</a
                                    >
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div
                    class="flex gap-4 max-w-18 w-18 h-full items-center justify-end"
                >
                    <div
                        class="opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                        <a
                            @click="
                                $main.AddPopup(
                                    {
                                        title: 'Login',
                                        description:
                                            'Input your Private Abyss Login Token, to save this for future events.',
                                    },
                                    () =>
                                        import('@/main/components/popup/Login.vue'),
                                    true,
                                )
                            "
                            >Login</a
                        >
                    </div>
                    <div
                        class="flex px-4 py-1 [&_text]:opacity-70 hover:[&_text]:opacity-90 bg-accent/50 hover:bg-accent rounded-md border border-bg-accent cursor-pointer transition-colors duration-300"
                        @click="
                            $main.AddPopup(
                                {
                                    title: 'Purchase',
                                    description:
                                        'Purchase your first key, and get started with Abyss today.',
                                },
                                () =>
                                    import('@/main/components/popup/Purchase.vue'),
                                true,
                            )
                        "
                    >
                        <text
                            class="select-none transition-opacity duration-300"
                            >Purchase</text
                        >
                    </div>
                </div>
            </div>
            <div
                v-show="$main.GetMenuStyle() === 'BOTTOM_BAR'"
                class="flex flex-row absolute bottom-5 gap-2 w-fit h-10 z-100"
            >
                <div
                    class="flex flex-row gap-1 px-1 py-1 bg-card border rounded-md"
                >
                    <div
                        class="flex bg-accent/45 hover:bg-accent rounded-md transition-all duration-300"
                    >
                        <div class="flex items-center justify-start px-2 py-1">
                            <Favicon class="size-4" />
                        </div>
                    </div>
                    <div
                        class="flex opacity-40 text-destructive bg-destructive/15 hover:opacity-100 hover:bg-destructive/25 rounded-md transition-all duration-300 cursor-pointer"
                        @click="$main.SetMenuStyle('TOP_BAR')"
                    >
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div
                                    class="flex items-center justify-start px-2 py-1"
                                >
                                    <ScanQrCode class="size-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Switch to top bar.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div
                        class="flex opacity-40 bg-accent/45 hover:bg-accent hover:opacity-100 rounded-md transition-all duration-300 cursor-pointer"
                    >
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <a
                                    class="flex items-center justify-start px-2 py-1"
                                    href="http://79.105.152.67:59345/"
                                >
                                    <LayoutTemplate class="size-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Route to orignal website.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <div
                    class="flex flex-row gap-1 px-1 py-1 bg-card border rounded-md"
                >
                    <div
                        v-for="value in $home.pages"
                        class="flex gap-2 opacity-40 bg-accent/45 hover:opacity-100 hover:bg-accent rounded-md transition-all duration-300 cursor-pointer"
                    >
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <a
                                    :href="value.href"
                                    class="flex items-center justify-start px-2 py-1"
                                >
                                    <component
                                        class="size-4"
                                        :is="value.icon"
                                    />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{{ value.id }}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <div
                    class="flex flex-row gap-2 px-1 py-1 bg-card border rounded-md"
                >
                    <div
                        class="flex opacity-40 bg-accent/45 hover:bg-accent hover:opacity-100 rounded-md transition-all duration-300 cursor-pointer"
                    >
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <a
                                    class="flex items-center justify-start px-2 py-1"
                                    @click="
                                        $main.AddPopup(
                                            {
                                                title: 'Login',
                                                description:
                                                    'Input your Private Abyss Login Token, to save this for future events.',
                                            },
                                            () =>
                                                import('@/main/components/popup/Login.vue'),
                                            true,
                                        )
                                    "
                                >
                                    <LogIn class="size-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Login with token.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div
                        class="flex opacity-40 bg-yellow-300/15 text-yellow-300 hover:bg-yellow-300/25 hover:opacity-100 rounded-md transition-all duration-300 cursor-pointer"
                    >
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <a
                                    class="flex items-center justify-start px-2 py-1"
                                    @click="
                                        $main.AddPopup(
                                            {
                                                title: 'Purchase',
                                                description:
                                                    'Buy your first key (token), and get started with Abyss today.',
                                            },
                                            () =>
                                                import('@/main/components/popup/Purchase.vue'),
                                            true,
                                        )
                                    "
                                >
                                    <ShoppingBasket class="size-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Purchase your first token to gain access.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div
                class="flex flex-col items-center w-full h-full bg-background rounded-md p-2 overflow-y-scroll"
                v-smooth-scroll
                href="#home"
            >
                <HomePage />
            </div>
        </main>
    </TooltipProvider>
</template>
