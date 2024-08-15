<template>
    <div v-if="showMenu" class="w-full transition-all duration-500 lg:block">
        <div>
            <div class="flex items-center justify-between border-b p-2 sm:p-4">
                <h2 class="text-base font-semibold">{{ title }}</h2>
                <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10">{{ uniqueProductsCount }} productos </span>
            </div>
            <div class="max-h-[calc(100vh_-_220px)] min-h-[calc(100vh_-_220px)] overflow-x-hidden">
                <div v-if="cart.length">
                    <div v-for="(item, index) in cart" :key="index" class="border-b border-dashed p-2">
                        <div class="flex items-center gap-2">
                            <img :src="item.photo" alt="" class="h-12 w-12 rounded-md" />
                            <div class="flex flex-1 justify-between">
                                <div class="block">
                                    <h3 class="text-sm font-medium">{{ item.name }}</h3>
                                    <p class="text-xs text-gray-500">{{ item.unitOfMeasure }}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex items-center gap-0.5">
                                        <button type="button" class="size-6 rounded-full text-gray-600 transition duration-300 hover:bg-gray-600 hover:text-white hover:opacity-75" @click="decrementQuantity(item)">&minus;</button>
                                        <input type="number" v-model.number="item.quantity" min="1" class="h-8 w-10 rounded text-center ring-1 ring-gray-200 sm:text-sm" />
                                        <button type="button" class="size-6 rounded-full text-gray-600 transition duration-300 hover:bg-gray-600 hover:text-white hover:opacity-75" @click="incrementQuantity(item)">&plus;</button>
                                    </div>
                                    <button type="button" class="rounded-md px-2 py-1.5 text-sm text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white" @click="removeFromCart(item.id)">
                                        <Icon name="my-icon:delete" size="20" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>No hay productos en el carrito.</p>
                </div>
            </div>
            <div class="flex justify-center border-t p-2 sm:p-4">
                <PrimaryButton :disabled="cart.length === 0" @click="$emit('toggle-quote-modal')">Realizar Cotización</PrimaryButton>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        showMenu: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
        uniqueProductsCount: {
            type: Number,
            required: true,
        },
        cart: {
            type: Array,
            required: true,
        },
        removeFromCart: {
            type: Function,
            required: true,
        },
        incrementQuantity: {
            type: Function,
            required: true,
        },
        decrementQuantity: {
            type: Function,
            required: true,
        },
    });
</script>
