<template>
    <div class="bg-red-300">
        <div v-for="(category, index) in products" :key="index">
            <h2>{{ category.name }}</h2>
            <div v-for="(subcategory, subcategoryIndex) in category.subcategories" :key="subcategoryIndex">
                <h3>{{ subcategory.name }}</h3>
                <ul>
                    <li v-for="(product, productIndex) in subcategory.products" :key="productIndex">{{ product.name }} - {{ product.description }} - {{ product.price }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from "vue";

    const products = ref([]);

    onMounted(async () => {
        try {
            const supplierId = "e5fb996e-6614-4465-b2a9-2254a3405f75"; // Replace with your supplierId
            const response = await fetch(`http://localhost:8000/api/sp/${supplierId}`);
            const data = await response.json();
            products.value = data;
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    });
</script>
