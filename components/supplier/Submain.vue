<script setup>
    import {showMenu} from "@/services/menuService";
</script>
<template>
    <div :class="['grid gap-2 sm:gap-4', showMenu ? 'grid-cols-2 md:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6']">
        <slot />
    </div>
</template>
