<script setup lang="ts">
import "./App.css";
import ThemeToggle from "@/main/components/ThemeToggle.vue";

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
</script>

<template>
    <ThemeToggle />
    <main class="flex w-full h-screen p-2 bg-card">
        <div class="flex w-full h-full bg-background rounded-md p-2">
            <div class="flex p-5 w-full h-fit relative">
                <Logo class="w-18 h-auto mr-auto" />
                <div
                    class="flex flex-1 justify-center items-center absolute left-1/2 right-1/2"
                >
                    <NavigationMenu :viewport="false">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    class="opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-full"
                                >
                                    <text>Menu</text>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent> </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    :class="navigationMenuTriggerStyle()"
                                    class="opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer"
                                >
                                    <text class="select-none">Docs</text>
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
                        Login
                    </div>
                    <div
                        class="flex px-4 py-1 [&_text]:opacity-70 hover:[&_text]:opacity-90 bg-accent/50 hover:bg-accent rounded-full border border-foreground/20 hover:border-foreground/80 cursor-pointer transition-colors duration-300"
                    >
                        <text
                            class="select-none transition-transition-opacity duration-300"
                            >Purchase</text
                        >
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
