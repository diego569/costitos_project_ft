<script setup>
    import {showMenu} from "@/services/menuService";
</script>
<template>
    <div :class="['grid gap-2 sm:gap-4', showMenu ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5']">
        <slot />
    </div>
</template>
