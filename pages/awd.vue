<template>
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="h-full w-64 overflow-y-auto bg-gray-100 p-4">
            <h2 class="mb-4 text-lg font-bold">CATEGORÍAS</h2>
            <ul>
                <li v-for="category in categories" :key="category.id" class="mb-2">
                    <a href="#" @click.prevent="toggleCategory(category.id)" class="flex items-center text-gray-700 hover:text-orange-500">
                        <span class="mr-2">{{ category.isOpen ? "▼" : "▶" }}</span>
                        {{ category.name }}
                    </a>
                    <ul v-if="category.isOpen" class="ml-4 mt-2">
                        <li v-for="subcategory in category.subcategories" :key="subcategory.id" class="mb-1">
                            <a href="#" :class="{'font-bold text-orange-500': subcategory.isActive, 'text-gray-700': !subcategory.isActive}">
                                {{ subcategory.name }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto p-4">
            <!-- Breadcrumb -->
            <div class="mb-4 text-sm text-gray-500">Home / Mis productos / Mobiliario en general / Muebles de comedor</div>

            <div class="mb-4 flex items-center justify-between">
                <h1 class="text-2xl font-bold">Muebles de comedor</h1>
                <button class="rounded bg-orange-500 px-4 py-2 text-white">+ Agregar nuevo producto</button>
            </div>

            <!-- Product grid -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <div v-for="product in products" :key="product.id" class="rounded border p-2">
                    <img :src="product.image" :alt="product.name" class="mb-2 h-40 w-full object-cover" />
                    <h3 class="font-semibold">{{ product.name }}</h3>
                    <p class="font-bold text-orange-500">s/ {{ product.price.toFixed(2) }}</p>
                    <p class="text-xs text-gray-500">{{ product.description }}</p>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex justify-center">
                <button v-for="page in totalPages" :key="page" :class="['mr-2 h-8 w-8 rounded-full', page === currentPage ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700']">
                    {{ page }}
                </button>
                <button class="h-8 w-8 rounded-full bg-gray-200 text-gray-700">></button>
            </div>
        </main>
    </div>
</template>

<script setup>
    import {ref, reactive} from "vue";

    const categories = reactive([
        {
            id: 1,
            name: "MOBILIARIO EN GENERAL",
            isOpen: true,
            subcategories: [
                {id: 1, name: "Muebles de sala", isActive: false},
                {id: 2, name: "Muebles de comedor", isActive: true},
                {id: 3, name: "Muebles de dormitorio", isActive: false},
            ],
        },
        // Add more categories as needed
    ]);

    const products = ref([
        {
            id: 1,
            name: "Comedor de 8 sillas con plataforma de vidrio",
            price: 76.0,
            image: "/path_to_dining_set_image.jpg",
            description: "180W, 3000K Intelligent Electricity Saving Box with LED Indicator Light Energy-Saving Device Electricity Bill Killer Up to 35%",
        },
        // Add more products as needed
    ]);

    const currentPage = ref(1);
    const totalPages = ref(3);

    function toggleCategory(categoryId) {
        const category = categories.find((c) => c.id === categoryId);
        if (category) {
            category.isOpen = !category.isOpen;
        }
    }
</script>

<style scoped>
    /* Add any additional styles not covered by Tailwind here */
</style>
