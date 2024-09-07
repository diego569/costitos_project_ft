<template></template>

<script setup>
    import {useRouter} from "vue-router";
    import {getUserRole} from "~/services/auth";

    const router = useRouter();

    onMounted(() => {
        redirectBasedOnRole();
    });

    const redirectBasedOnRole = () => {
        const role = getUserRole();

        if (role === "user") {
            router.push({name: "catalogo"});
        } else if (role === "supplier") {
            router.push({name: "explorar"});
        } else {
            router.push({name: "catalogo"});
        }
    };
</script>
