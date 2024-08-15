<script setup>
    import {ref, onMounted} from "vue";

    import {BookOpenIcon, CogIcon, MagnifyingGlassIcon, ChevronDownIcon, ClipboardDocumentCheckIcon} from "@heroicons/vue/24/outline";
    import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
    import {Bars3Icon, BellIcon, XMarkIcon, UserIcon, ShoppingCartIcon, RectangleGroupIcon, UserGroupIcon} from "@heroicons/vue/24/outline";

    const user = ref(null);

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/auth/salir/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al cerrar sesión");
            }

            user.value = null;
            localStorage.removeItem("token");
            localStorage.removeItem("userData");

            router.push({name: "ingresar"});
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const isLocalStorageAvailable = () => {
        try {
            const test = "__localStorageTest__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    onMounted(() => {
        if (isLocalStorageAvailable()) {
            const storedUser = localStorage.getItem("userData");
            if (storedUser) {
                user.value = JSON.parse(storedUser);
            }
        }
    });
    const menuItems = {
        Catalogo: [
            {name: "Catálogo general", icon: BookOpenIcon, link: "/admin/catalogo"},
            {name: "Revisar nuevos productos", icon: ClipboardDocumentCheckIcon, link: "/admin/catalogo/revisar"},
        ],
        Usuarios: [{name: "Administrar", icon: CogIcon, link: "/admin/usuarios"}],
        Cotizaciones: [{name: "Buscar cotizaciones", icon: MagnifyingGlassIcon, link: "/admin/cotizaciones"}],
    };
</script>
<template>
    <div class="fixed inset-0 flex overflow-hidden">
        <div class="relative hidden w-full flex-shrink-0 flex-col items-stretch border-b border-gray-200 lg:flex lg:w-[--width] lg:border-b-0 lg:border-r dark:border-gray-800">
            <div class="flex h-[--header-height] min-w-0 flex-shrink-0 items-center gap-x-4 border-b !border-transparent border-gray-200 px-4">
                <div class="flex min-w-0 flex-1 items-center justify-between gap-x-1.5">
                    <div class="flex min-w-0 flex-1 items-stretch gap-1.5">
                        <button
                            type="button"
                            class="inline-flex flex-shrink-0 items-center gap-x-1.5 rounded-md p-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-75 lg:hidden"
                            aria-label="Open sidebar">
                            <span class="iconify i-heroicons:bars-3-20-solid h-5 w-5 flex-shrink-0" aria-hidden="true"></span>
                        </button>
                        <div class="relative inline-flex w-full text-left rtl:text-right">
                            <div class="inline-flex w-full" role="button">
                                <button
                                    type="button"
                                    class="inline-flex w-full flex-shrink-0 items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-75">
                                    <span class="relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px]">
                                        <img class="h-5 w-5 rounded-full text-[10px]" src="https://avatars.githubusercontent.com/u/23360933?s=200&amp;v=4" />
                                    </span>
                                    <span class="truncate font-semibold text-gray-900">Nuxt</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="relative flex w-full flex-1 flex-col overflow-hidden">
                <div class="flex min-h-0 flex-grow flex-col gap-y-2 py-2">
                    <div class="flex flex-1 flex-col gap-y-2 overflow-y-auto px-4">
                        <ul class="relative min-h-[auto] min-w-[auto]">
                            <li v-for="(items, section) in menuItems" :key="section" class="!overflow-visible">
                                <div>
                                    <div class="flex">
                                        <p
                                            class="group relative flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-500 before:absolute before:inset-px before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset focus-visible:before:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-75"
                                            draggable="false">
                                            <span class="relative truncate text-sm">{{ section }}</span>
                                        </p>
                                    </div>
                                    <ul class="relative !min-h-[auto] !min-w-[auto]">
                                        <li v-for="item in items" :key="item.name" class="!overflow-visible">
                                            <div class="relative flex">
                                                <a
                                                    :href="item.link"
                                                    class="group relative flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-500 before:absolute before:inset-px before:rounded-md hover:text-gray-900 hover:before:bg-gray-50 focus:outline-none focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset focus-visible:before:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-75"
                                                    draggable="false">
                                                    <component :is="item.icon" class="relative h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-700" aria-hidden="true" />
                                                    <span class="relative truncate text-sm">{{ item.name }}</span>
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>

                        <div class="flex-1"></div>
                    </div>
                    <div class="flex flex-shrink-0 items-center justify-between gap-x-1.5 px-4">
                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative w-full">
                            <div class="flex items-center">
                                <MenuButton class="relative flex w-full items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                    <span class="sr-only">Open user menu</span>
                                    <UserIcon class="h-6 w-6 text-gray-500" />

                                    <span class="ml-2 hidden md:block">{{ user?.name }}</span>
                                </MenuButton>
                            </div>
                            <transition
                                enter-active-class="transition ease-out duration-300"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute -top-24 left-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem v-slot="{active}">
                                        <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"> Configuracion </a>
                                    </MenuItem>
                                    <MenuItem v-slot="{active}">
                                        <a href="#" @click="logout" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"> Salir </a>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex w-full min-w-0 flex-1">
            <slot />
        </div>
    </div>
</template>
