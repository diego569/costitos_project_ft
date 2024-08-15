<script setup>
    const props = defineProps({
        catSlug: String,
        subcatSlug: String,
        productSlug: String,
    });
</script>
<template>
    <ol class="flex items-center whitespace-nowrap p-1 sm:p-3">
        <li class="inline-flex items-center">
            <NuxtLink to="/catalogo" class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none">Home</NuxtLink>
            <span class="mx-2 text-gray-400">/</span>
        </li>
        <li v-if="catSlug" class="inline-flex items-center">
            <NuxtLink :to="{name: 'catalogo-categoria-cat', params: {cat: catSlug}}" class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none">{{ catSlug }}</NuxtLink>
            <span v-if="subcatSlug" class="mx-2 text-gray-400">/</span>
        </li>
        <li v-if="subcatSlug" class="inline-flex items-center">
            <NuxtLink :to="{name: 'catalogo-categoria-cat-subcategoria-subcat', params: {cat: catSlug, subcat: subcatSlug}}" class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none">{{ subcatSlug }}</NuxtLink>
            <span v-if="productSlug" class="mx-2 text-gray-400">/</span>
        </li>
        <li v-if="productSlug" class="inline-flex items-center truncate text-sm font-semibold text-gray-800" aria-current="page">{{ productSlug }}</li>
    </ol>
</template>
