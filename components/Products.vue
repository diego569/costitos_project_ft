<template>
    <Container>
        <h1>Lista de Productos</h1>
        <ul>
            <li v-for="product in products" :key="product.id" class="p-2">
                <Card>
                    <img :src="product.photo" alt="Product Image" />
                    <h2>{{ product.name }}</h2>
                    <p>{{ product.description }}</p>
                    <p>Estado: {{ product.status }}</p>
                    <p>Fecha de Creación: {{ product.createdAt }}</p>
                    <NuxtLink :to="{name: 'catalogo-id', params: {id: product.id}}"> {{ product.id }} </NuxtLink>
                </Card>
            </li>
        </ul>
    </Container>
</template>

<script setup>
    import {ref, onMounted} from "vue";

    const products = ref([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/product/all/");
            const data = await response.json();
            products.value = data;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    onMounted(fetchProducts);
</script>
