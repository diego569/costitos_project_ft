<script setup>
    import {ref} from "vue";
    import {defineProps, defineEmits} from "vue";

    const props = defineProps({
        product: Object,
    });

    const emit = defineEmits(["agregar"]);

    const isLoading = ref(true);

    const handleImageLoad = () => {
        isLoading.value = false;
    };

    const selectedProduct = ref(null);
    const showProductDetailModal = ref(false);

    const openProductDetailModal = () => {
        selectedProduct.value = props.product;
        showProductDetailModal.value = true;
    };

    const closeProductDetailModal = () => {
        showProductDetailModal.value = false;
    };

    const selectedSupplierProductId = ref(null);
    const selectedProductName = ref(null);
    const showDeleteModal = ref(false);

    const openDeleteModal = (product) => {
        selectedSupplierProductId.value = product.supplier_product_id;
        selectedProductName.value = product.name;
        showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
        showDeleteModal.value = false;
    };

    const handleProductDeleted = () => {
        showDeleteModal.value = false;
        window.location.reload();
    };
</script>

<template>
    <div class="relative flex flex-col justify-between rounded-xl bg-white bg-clip-border p-2 text-gray-700 transition-all duration-200 hover:shadow-md">
        <button @click="openDeleteModal(product)" class="absolute right-3 top-3 z-10 rounded-lg border border-gray-200 bg-white/70 p-1.5 transition hover:bg-red-500 hover:text-white">
            <Icon name="my-icon:trash" size="20" />
        </button>

        <div @click="openProductDetailModal">
            <div class="relative aspect-square overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700">
                <img v-show="!isLoading" :src="product.photo" @load="handleImageLoad" alt="card-image" class="h-full w-full object-cover object-center" />
                <div v-show="isLoading" class="flex h-full w-full animate-pulse items-center justify-center bg-gray-200">
                    <svg class="h-5 w-5 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.29l-1.42-1.42C6.6 14.09 7 12.6 7 11H5c0 1.76-.55 3.4-1.49 4.71L6 17.29z"></path>
                    </svg>
                </div>
            </div>
            <div class="p-2 sm:p-3">
                <div class="mb-2 flex items-center justify-between">
                    <p class="line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased">{{ product.name }}</p>
                </div>
                <p class="line-clamp-2 font-sans text-xs font-normal leading-normal text-gray-700 antialiased opacity-75 sm:line-clamp-3">{{ product.description }}</p>
            </div>
        </div>

        <div class="flex justify-between p-2">
            <div class="line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased">S/. {{ product.price }}</div>
            <div class="line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased">{{ product.unit_of_measure }}</div>
        </div>
    </div>

    <SupplierProductView :showModal="showProductDetailModal" :product="selectedProduct" :closeModal="closeProductDetailModal" />

    <SupplierDeleteProduct :showModal="showDeleteModal" :supplierProductId="selectedSupplierProductId" :productName="selectedProductName" :closeModal="closeDeleteModal" @productDeleted="handleProductDeleted" />
</template>
