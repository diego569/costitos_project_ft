<script setup>
    const props = defineProps({
        category: Object,
        subcategory: Object,
    });

    const item = props.category || props.subcategory;
    const isSubcategory = !!props.subcategory;
</script>

<template>
    <div>
        <NuxtLink :to="{name: isSubcategory ? 'explorar-subcategoria-slug' : 'explorar-categoria-slug', params: {slug: item.slug}}" class="flex h-16 cursor-pointer items-center rounded-xl border bg-white bg-clip-border text-gray-700 transition-all duration-300 hover:shadow-md">
            <div class="aspect-square">
                <img :src="item.photo" alt="category-image" class="h-16 rounded-l-md object-cover object-center" />
            </div>
            <div class="flex size-full items-center p-2">
                <p class="font-sans text-sm font-normal leading-normal text-gray-900 antialiased">{{ item.name }}</p>
            </div>
        </NuxtLink>
    </div>
</template>
