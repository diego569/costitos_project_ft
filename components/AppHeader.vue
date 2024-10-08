<script setup>
    import {useRouter} from "vue-router";
    import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
    import {Bars3Icon, BellIcon, XMarkIcon, UserIcon, ShoppingCartIcon, RectangleGroupIcon, UserGroupIcon} from "@heroicons/vue/24/outline";
    import {apiurl} from "~/services/api.js";

    const user = ref(null);
    const router = useRouter();

    const navigateToLogin = () => {
        localStorage.setItem("previousRoute", router.currentRoute.value.fullPath);
        router.push({name: "ingresar"});
    };

    const logout = async () => {
        try {
            const response = await fetch(apiurl("/auth/salir/logout"), {
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

    const navigation = [
        {name: "Catalogo", href: "/catalogo", icon: RectangleGroupIcon},
        {name: "Proveedores", href: "/proveedores", icon: UserGroupIcon},
    ];
</script>

<template>
    <Disclosure as="nav" class="z-50 block w-full min-w-[360px] bg-white shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="relative flex h-navbar items-center justify-between">
                <div class="flex h-full flex-1 items-center justify-start sm:items-stretch sm:justify-start">
                    <div class="flex flex-shrink-0 items-center">
                        <a href="http://localhost:3000/" class="flex items-center space-x-2">
                            <LogosFigura class="h-8 w-8" />
                            <LogosTexto class="h-4 w-auto" />
                        </a>
                    </div>
                    <div class="hidden gap-4 sm:ml-6 sm:flex">
                        <router-link
                            v-for="item in navigation"
                            :key="item.name"
                            :to="item.href"
                            :class="[$route.path === item.href ? 'border-b-2 border-primary-500 text-black' : 'border-transparent hover:border-b-2 hover:border-primary-500 hover:text-black', 'flex h-full items-center border-b-2 px-1.5 text-sm font-normal']"
                            :aria-current="$route.path === item.href ? 'page' : undefined">
                            <component :is="item.icon" :class="[$route.path === item.href ? 'stroke-primary-500' : ' ', 'mr-2 h-6 w-6']" aria-hidden="true" />
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center gap-3 sm:static sm:inset-auto sm:pr-0">
                    <button type="button" class="relative rounded-md bg-gray-100 p-1.5 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        <span class="sr-only">View notifications</span>
                        <ShoppingCartIcon class="h-6 w-6 text-gray-500" />
                    </button>

                    <!-- Profile dropdown -->
                    <Menu as="div" class="relative">
                        <div v-if="!user">
                            <button @click="navigateToLogin" class="relative inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">Ingresar</button>
                        </div>
                        <div v-else>
                            <MenuButton class="relative flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
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
                            <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem v-slot="{active}">
                                    <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Profile</a>
                                </MenuItem>
                                <MenuItem v-slot="{active}">
                                    <a href="/cotizaciones" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Cotizaciones</a>
                                </MenuItem>
                                <MenuItem v-slot="{active}">
                                    <a href="#" @click="logout" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Salir</a>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
                    <div class="sm:hidden">
                        <!-- Mobile menu button-->
                        <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                            <span class="absolute -inset-0.5" />
                            <span class="sr-only">Open main menu</span>
                            <Bars3Icon class="block h-6 w-6" aria-hidden="true" />
                        </DisclosureButton>
                    </div>
                </div>
            </div>
        </div>

        <DisclosurePanel class="sm:hidden">
            <transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div class="fixed inset-0 z-50 overflow-hidden bg-white">
                    <div class="flex justify-end pr-4 pt-3">
                        <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                            <span class="absolute -inset-0.5" />
                            <span class="sr-only">Close main menu</span>
                            <Bars3Icon v-if="open" class="block h-6 w-6" aria-hidden="true" />
                            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                        </DisclosureButton>
                    </div>
                    <div class="space-y-1 px-2 pb-3 pt-4">
                        <DisclosureButton
                            v-for="item in navigation"
                            :key="item.name"
                            as="a"
                            :href="item.href"
                            :class="[$route.path === item.href ? 'bg-primary-100 text-gray-800' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800', 'flex rounded-md px-3 py-2 text-base font-medium']"
                            :aria-current="$route.path === item.href ? 'page' : undefined">
                            <component :is="item.icon" :class="[$route.path === item.href ? 'stroke-primary-500' : ' ', 'mr-2 h-6 w-6']" aria-hidden="true" />
                            {{ item.name }}
                        </DisclosureButton>
                    </div>
                </div>
            </transition>
        </DisclosurePanel>
    </Disclosure>
</template>
