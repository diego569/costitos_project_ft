<script setup>
    import {showMenu} from "@/services/menuService";
</script>
<template>
    <div :class="['grid gap-2', showMenu ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6']">
        <slot />
    </div>
</template>
