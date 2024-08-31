<script setup>
    import {ref, computed, onMounted} from "vue";

    const props = defineProps({
        items: {
            type: Array,
            required: true,
        },
        category: {
            type: Boolean,
            default: false,
        },
        subcategory: {
            type: Boolean,
            default: false,
        },
    });

    const isImageLoaded = ref(false);
    const showAllCategories = ref(false);
    const isMobile = ref(false);

    const isSubcategory = computed(() => props.subcategory);

    const handleImageLoad = () => {
        isImageLoaded.value = true;
    };

    onMounted(() => {
        // Detecta si es un dispositivo móvil o pantalla más grande
        isMobile.value = window.innerWidth <= 768;
    });

    const displayedItems = computed(() => {
        const initialLimit = isMobile.value ? 6 : 15;
        if (showAllCategories.value) {
            return props.items;
        }
        return props.items.slice(0, initialLimit);
    });

    const toggleCategories = () => {
        showAllCategories.value = !showAllCategories.value;
    };
</script>

<template>
    <div v-for="item in displayedItems" :key="item.slug">
        <NuxtLink :to="{name: isSubcategory ? 'catalogo-subcategoria-slug' : 'catalogo-categoria-slug', params: {slug: item.slug}}" class="flex h-16 cursor-pointer items-center rounded-xl border bg-white bg-clip-border text-gray-700 transition-all duration-300 hover:shadow-md">
            <div class="flex aspect-square h-16 w-16 items-center justify-center overflow-hidden rounded-l-md bg-gray-200">
                <div v-if="!isImageLoaded" class="h-full w-full animate-pulse rounded-l-md bg-gray-300"></div>
                <img v-if="item.photo" :src="item.photo" alt="category-image" class="object-cover" @load="handleImageLoad" />
            </div>
            <div class="flex size-full items-center p-2">
                <p class="font-sans text-sm font-normal leading-normal text-gray-900 antialiased">{{ item.name }}</p>
            </div>
        </NuxtLink>
    </div>

    <div v-if="props.items.length > (isMobile.value ? 6 : 15)" class="mt-4">
        <button @click="toggleCategories" class="text-primary-600 hover:text-primary-800">
            <p class="select-none font-sans text-sm font-medium">
                {{ showAllCategories.value ? "Mostrar menos" : "Mostrar todos" }}
            </p>
        </button>
    </div>
</template>
