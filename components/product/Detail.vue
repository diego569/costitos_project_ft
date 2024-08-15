<script setup>
    const props = defineProps({
        product: {
            type: Object,
            required: true,
        },
    });
</script>
<template>
    <Container>
        <Card>
            <h1>{{ product.name }}</h1>
            <img :src="product.photo" alt="Product Image" />
            <p>{{ product.description }}</p>
            <p>Estado: {{ product.status }}</p>
            <p>Fecha de Creación: {{ product.createdAt }}</p>
        </Card>
    </Container>
</template>
