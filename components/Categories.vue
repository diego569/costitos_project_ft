<template>
    <Container>
        <h1>Categoriesdawd</h1>
        <br />
        <div class="grid grid-cols-3 justify-center gap-3 md:grid-cols-6 lg:grid-cols-8">
            <a
                v-for="category in categories"
                :key="category.id"
                @click="handleCategoryClick(category)"
                class="block cursor-pointer rounded-lg border border-primary-200 bg-white px-4 py-8 text-center shadow-primary-400/10 transition-all duration-300 hover:bg-primary-300 hover:shadow-xl dark:border-primary-700 dark:bg-primary-800 hover:dark:shadow-primary-800/10">
                <h3 class="font-heading text-muted-800 text-base font-semibold dark:text-white">
                    {{ category.name }}
                </h3>
                <p class="text-muted-500 dark:text-muted-400 sr-only font-sans text-sm">{{ category.name }}</p>
            </a>
        </div>
    </Container>
</template>

<script setup>
    import {ref, onMounted} from "vue";
    import {useRouter} from "vue-router";

    const categories = ref([]);
    const router = useRouter();

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/category/all");
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            categories.value = data;
        } catch (error) {
            console.error(error);
        }
    };

    const handleCategoryClick = (category) => {
        sessionStorage.setItem("categoryId", category.id);
        router.push(`/categoria-${category.name}`);
    };

    onMounted(fetchCategories);
</script>
