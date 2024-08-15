<script setup>
    const props = defineProps({
        supplier: {
            type: Object,
            required: true,
        },
    });
</script>

<template>
    <Container>
        <Card>
            <h1>{{ supplier.name }}</h1>
            <p>{{ supplier.legalRepresentative }}</p>
            <p>{{ supplier.businessName }}</p>
            <p>{{ supplier.economicActivity }}</p>
            <p>{{ supplier.fiscalAddress }}</p>
            <p>{{ supplier.ruc }}</p>
            <p>{{ supplier.email }}</p>
            <p>{{ supplier.cellphone }}</p>
            <p>Estado: {{ supplier.enabled }}</p>
            <p>Fecha de Creación: {{ supplier.createdAt }}</p>
        </Card>
    </Container>
</template>
