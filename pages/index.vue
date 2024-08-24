<template></template>

<script setup>
    import {useRouter} from "vue-router";

    const router = useRouter();

    onMounted(() => {
        redirectToCatalogo();
    });

    const redirectToCatalogo = () => {
        router.push({name: "catalogo"});
    };
</script>
