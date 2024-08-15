<!-- <template>
    <div class="flex h-80 w-56 flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-xl">
        <NuxtLink :to="{name: 'producto-id', params: {id: product.id}}">
            <div class="relative min-h-40">
                <img :src="product.photo" alt="" class="sizes-40 transition-transform duration-200" />
                <div class="absolute start-1.5 top-1.5">
                    <span v-if="product.unitOfMeasure" class="relative inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 text-center font-sans text-xs leading-10 text-gray-500 transition-all duration-300">{{
                        product.unitOfMeasure
                    }}</span>
                </div>
            </div>
            <div class="flex h-24 flex-col gap-y-2 px-2 pt-2">
                <p class="text-md font-medium tracking-wide text-gray-700">{{ product.name }}</p>
                <p class="line-clamp-2 overflow-hidden text-xs text-gray-500">{{ product.description }}</p>
            </div>
        </NuxtLink>

        <div class="flex justify-between border-t px-2 py-3">
            <div class="flex items-center gap-2">
                <label for="Quantity" class="sr-only">Quantity</label>
                <input type="number" v-model.number="product.price" min="1" class="h-8 w-10 rounded border-gray-200 text-center sm:text-sm" />
                <input type="text" v-model.number="product.unitOfMeasure" min="1" class="h-8 w-10 rounded border-gray-200 text-center sm:text-sm" />
            </div>
            <div class="ms-auto">
                <PrimaryButton @click="addToCart(product)">Añadir</PrimaryButton>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {defineProps} from "vue";

    const props = defineProps({
        product: {
            type: Object,
            required: true,
        },
        addToCart: {
            type: Function,
            required: true,
        },
    });
</script>

<style scoped>
 </style> -->
<template>
    <div class="flex h-72 w-56 flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-xl">
        <!-- <NuxtLink :to="{name: 'producto-id', params: {id: product.id}}"> -->
        <div class="group relative min-h-40">
            <img :src="product.photo" alt="" class="sizes-40 transition-transform duration-200 group-hover:opacity-70" />
            <div class="absolute inset-0 bg-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-30"></div>
            <div class="absolute start-1.5 top-1.5">
                <span v-if="product.unitOfMeasure" class="relative inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 text-center font-sans text-xs leading-10 text-gray-500 transition-all duration-300">{{
                    product.unitOfMeasure
                }}</span>
            </div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <PrimaryButton @click="addToCart(product)">Agregar</PrimaryButton>
            </div>
        </div>
        <div class="flex h-24 flex-col gap-y-2 px-2 pt-2">
            <NuxtLink :to="{name: 'producto-id', params: {id: product.id}}">
                <p class="text-md font-medium tracking-wide text-gray-700">{{ product.name }}</p>
            </NuxtLink>
            <p class="line-clamp-2 overflow-hidden text-xs text-gray-500">{{ product.description }}</p>
        </div>
        <!-- </NuxtLink> -->
    </div>
</template>

<script setup>
    import {defineProps} from "vue";

    const props = defineProps({
        product: {
            type: Object,
            required: true,
        },
        addToCart: {
            type: Function,
            required: true,
        },
    });
</script>
