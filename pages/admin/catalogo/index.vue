<script setup>
    import {ref, onMounted} from "vue";
    import {TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle} from "@headlessui/vue";
    import {showMenu} from "@/services/menuService";
    const supplierId = "92c05463-e920-4153-bc38-5c6352701769";

    const categories = ref([]);
    const subcategories = ref([]);
    const products = ref([]);
    const defaultSearchResults = ref([]);
    const categorySearchResults = ref([]);
    const subcategorySearchResults = ref([]);
    const categorySearchQuery = ref("");
    const subcategorySearchQuery = ref("");
    const isLoadingCategories = ref(true);
    const isLoadingProducts = ref(false);
    const isLoadingDefaultSearchResults = ref(false);
    const isLoadingCategorySearchResults = ref(false);
    const isLoadingSubcategorySearchResults = ref(false);
    const selectedCategory = ref(null);
    const selectedSubcategory = ref(null);

    const fetchCategoriesBySupplier = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/getcategoriesbysupplier2/${supplierId}`);
            if (!response.ok) throw new Error("Failed to fetch categories");

            const data = await response.json();
            categories.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingCategories.value = false;
        }
    };

    const fetchSubcategoriesBySupplierAndCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/getsubcategoriesbysupplierandcategory/${supplierId}/${categoryId}`);
            if (!response.ok) throw new Error("Failed to fetch subcategories");

            const data = await response.json();
            subcategories.value = data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        isLoadingProducts.value = true;
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/products`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            products.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const fetchProductsBySupplierAndCategory = async (categoryId) => {
        isLoadingProducts.value = true;
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/getproductsbycategory/${categoryId}`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            products.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const fetchProductsBySupplierAndSubcategory = async (subcategoryId) => {
        isLoadingProducts.value = true;
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/getproductsbysubcategory/${subcategoryId}`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            products.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const searchProducts = async () => {
        if (!categorySearchQuery.value.trim()) {
            defaultSearchResults.value = [];
            return;
        }

        isLoadingDefaultSearchResults.value = true;
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/searchproducts?query=${categorySearchQuery.value}`);
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            products.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingDefaultSearchResults.value = false;
        }
    };

    const searchProductsBySupplierAndCategory = async () => {
        if (!categorySearchQuery.value.trim()) {
            categorySearchResults.value = [];
            return;
        }

        isLoadingCategorySearchResults.value = true;
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/searchproductsbycategory/${selectedCategory.value}?query=${categorySearchQuery.value}`);
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            categorySearchResults.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingCategorySearchResults.value = false;
        }
    };

    const searchProductsBySupplierAndSubcategory = async () => {
        if (!subcategorySearchQuery.value.trim()) {
            subcategorySearchResults.value = [];
            return;
        }

        isLoadingSubcategorySearchResults.value = true;
        try {
            const response = await fetch(`http://localhost:8000/api/admin/catalogo/searchproductsbysubcategory/${selectedSubcategory.value}?query=${subcategorySearchQuery.value}`);
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            subcategorySearchResults.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingSubcategorySearchResults.value = false;
        }
    };

    const selectCategory = (category) => {
        if (selectedCategory.value === category.id) {
            selectedCategory.value = null;
            selectedSubcategory.value = null;
            subcategories.value = [];
            fetchProducts();
        } else {
            selectedCategory.value = category.id;
            selectedSubcategory.value = null;
            fetchSubcategoriesBySupplierAndCategory(category.id);
            fetchProductsBySupplierAndCategory(category.id);
        }
        categorySearchQuery.value = "";
        subcategorySearchQuery.value = "";
        categorySearchResults.value = [];
        subcategorySearchResults.value = [];
    };

    const selectSubcategory = (subcategory) => {
        if (selectedSubcategory.value === subcategory.id) {
            selectedSubcategory.value = null;
            fetchProductsBySupplierAndCategory(selectedCategory.value);
        } else {
            selectedSubcategory.value = subcategory.id;
            fetchProductsBySupplierAndSubcategory(subcategory.id);
        }
        subcategorySearchQuery.value = "";
        subcategorySearchResults.value = [];
    };

    onMounted(() => {
        fetchCategoriesBySupplier();
        fetchProducts();
    });

    const showModal = ref(false);

    const openModal = () => {
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
    };
</script>
<template>
    <template>
        <Main class="max-h-[calc(100vh_-_20px)]">
            <div class="col-span-3 overflow-auto rounded-lg border bg-white md:col-span-2">
                <h6 class="p-3 text-lg font-bold">Categorías</h6>
                <div class="overflow-auto">
                    <div v-for="category in categories" :key="category.id">
                        <div @click="selectCategory(category)" :class="{'text-black': selectedCategory === category.id, 'text-gray-600': selectedCategory !== category.id}" class="cursor-pointer border-t p-2 hover:bg-primary-200">
                            <div class="flex size-full items-center p-1.5">
                                <Icon :name="selectedCategory === category.id ? 'my-icon:caret-down' : 'my-icon:caret-right'" size="20" />
                                <Icon :name="selectedCategory === category.id ? 'my-icon:folder-open' : 'my-icon:folder-close'" size="20" class="ml-2" />
                                <p class="ml-2 font-sans text-sm font-normal leading-normal antialiased">{{ category.name }}</p>
                            </div>
                        </div>
                        <div v-if="selectedCategory === category.id">
                            <div
                                v-for="subcategory in subcategories"
                                :key="subcategory.id"
                                @click="selectSubcategory(subcategory)"
                                :class="{'bg-primary-500 text-white': selectedSubcategory === subcategory.id, 'text-gray-600 hover:bg-primary-200': selectedSubcategory !== subcategory.id}"
                                class="cursor-pointer border-t p-2 text-gray-400">
                                <div class="flex size-full items-center p-1.5">
                                    <Icon name="my-icon:circles-four" size="20" class="ml-2" />
                                    <p class="ml-2 font-sans text-sm font-normal leading-normal antialiased">{{ subcategory.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="['hidden h-full overflow-auto rounded-lg md:block', showMenu ? 'col-span-2 2xl:col-span-3' : 'col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5']">
                <div v-if="!selectedCategory">
                    <div v-if="isLoadingProducts">
                        <p>Cargando productos...</p>
                    </div>
                    <div v-else>
                        <div class="flex justify-between">
                            <h6 class="p-1.5 text-lg font-bold">Buscar Productos</h6>
                            <button @click="openModal" class="relative flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-100">
                                <Icon name="my-icon:plus" size="20" class="ml-2" />
                                <span class="ml-2 hidden md:block"> Agregar nuevo producto</span>
                            </button>
                        </div>
                        <input type="text" v-model="categorySearchQuery" @input="searchProducts" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                        <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                        <div>
                            <ProductTable :product="products" />
                            <p v-if="!defaultSearchResults.length && categorySearchQuery.trim()">No se encontraron resultados para "{{ categorySearchQuery }}"</p>
                        </div>
                    </div>
                </div>
                <div v-if="selectedCategory && !selectedSubcategory">
                    <div v-if="isLoadingProducts">
                        <p>Cargando productos...</p>
                    </div>
                    <div v-else>
                        <div class="flex justify-between">
                            <h6 class="p-1.5 text-lg font-bold">Buscar Productos en Categoría</h6>
                            <button @click="openModal" class="relative flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-100">
                                <Icon name="my-icon:plus" size="20" class="ml-2" />
                                <span class="ml-2 hidden md:block"> Agregar nuevo producto</span>
                            </button>
                        </div>
                        <input type="text" v-model="categorySearchQuery" @input="searchProductsBySupplierAndCategory" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                        <div v-if="isLoadingCategorySearchResults">
                            <p>Cargando resultados...</p>
                        </div>
                        <div v-else>
                            <ProductTable :product="categorySearchResults" />

                            <p v-if="!categorySearchResults.length && categorySearchQuery.trim()">No se encontraron resultados para "{{ categorySearchQuery }}"</p>
                        </div>
                        <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                        <div>
                            <ProductTable :product="products" />
                        </div>
                    </div>
                </div>
                <div v-if="selectedSubcategory">
                    <div v-if="isLoadingProducts">
                        <p>Cargando productos...</p>
                    </div>
                    <div v-else>
                        <div class="flex justify-between">
                            <h6 class="p-1.5 text-lg font-bold">Buscar Productos en Subcategoría</h6>
                            <button @click="openModal" class="relative flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-100">
                                <Icon name="my-icon:plus" size="20" class="ml-2" />
                                <span class="ml-2 hidden md:block"> Agregar nuevo producto</span>
                            </button>
                        </div>
                        <input type="text" v-model="subcategorySearchQuery" @input="searchProductsBySupplierAndSubcategory" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                        <div v-if="isLoadingSubcategorySearchResults">
                            <p>Cargando resultados...</p>
                        </div>
                        <div v-else>
                            <ProductTable :product="subcategorySearchResults" />

                            <p v-if="!subcategorySearchResults.length && subcategorySearchQuery.trim()">No se encontraron resultados para "{{ subcategorySearchQuery }}"</p>
                        </div>
                        <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                        <div>
                            <ProductTable :product="products" />
                        </div>
                    </div>
                </div>
            </div>
        </Main>
        <TransitionRoot appear :show="showModal" as="template">
            <Dialog as="div" @close="closeModal" class="relative z-10">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black/25" />
                </TransitionChild>
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> Agregar nuevo producto </DialogTitle>
                                <div class="mt-2">
                                    <SupplierCreateProduct :categoryId="selectedCategory" :subcategoryId="selectedSubcategory" :closeModal="closeModal" />
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </template>
</template>
