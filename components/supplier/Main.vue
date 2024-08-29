<script setup>
    import {showMenu} from "@/services/menuService";
</script>
<template>
    <div :class="['grid gap-2 sm:gap-4', showMenu ? 'md:grid-cols-6 xl:grid-cols-8' : 'md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10']">
        <slot />
    </div>
</template>
