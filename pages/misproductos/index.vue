<script setup>
    import {ref, onMounted} from "vue";
    import {fetchWithAuth, getUserId} from "@/services/auth";
    import {TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle} from "@headlessui/vue";

    const supplierId = getUserId();

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
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/getcategoriesbysupplier2/${supplierId}`, "GET");
            categories.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingCategories.value = false;
        }
    };

    const fetchSubcategoriesBySupplierAndCategory = async (categoryId) => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/getsubcategoriesbysupplierandcategory/${supplierId}/${categoryId}`, "GET");
            subcategories.value = response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductsBySupplier = async () => {
        isLoadingProducts.value = true;
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/getproductsbysupplier/${supplierId}`, "GET");
            products.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const fetchProductsBySupplierAndCategory = async (categoryId) => {
        isLoadingProducts.value = true;
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/getproductsbysupplierandcategory/${supplierId}/${categoryId}`, "GET");
            products.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const fetchProductsBySupplierAndSubcategory = async (subcategoryId) => {
        isLoadingProducts.value = true;
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/getproductsbysupplierandsubcategory/${supplierId}/${subcategoryId}`, "GET");
            products.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const searchProductsBySupplier = async () => {
        if (!categorySearchQuery.value.trim()) {
            defaultSearchResults.value = [];
            return;
        }

        isLoadingDefaultSearchResults.value = true;
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/searchproductsbysupplier/${supplierId}?query=${categorySearchQuery.value}`, "GET");
            defaultSearchResults.value = response.data;
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
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/searchproductsbysupplierandcategory/${supplierId}/${selectedCategory.value}?query=${categorySearchQuery.value}`, "GET");
            categorySearchResults.value = response.data;
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
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/searchproductsbysupplierandsubcategory/${supplierId}/${selectedSubcategory.value}?query=${subcategorySearchQuery.value}`, "GET");
            subcategorySearchResults.value = response.data;
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
            fetchProductsBySupplier();
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
        fetchProductsBySupplier();
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
        <Main class="max-h-[calc(100vh_-_100px)]">
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
                        <input type="text" v-model="categorySearchQuery" @input="searchProductsBySupplier" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                        <div v-if="isLoadingDefaultSearchResults">
                            <p>Cargando resultados...</p>
                        </div>
                        <Main2 v-else>
                            <ProductCard3 v-for="product in defaultSearchResults" :key="product.supplier_product_id" :product="product" />
                            <p v-if="!defaultSearchResults.length && categorySearchQuery.trim()">No se encontraron resultados para "{{ categorySearchQuery }}"</p>
                        </Main2>
                        <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                        <Main2>
                            <ProductCard3 v-for="product in products" :key="product.supplier_product_id" :product="product" />
                        </Main2>
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
                        <Main2 v-else>
                            <ProductCard3 v-for="product in categorySearchResults" :key="product.supplier_product_id" :product="product" />
                            <p v-if="!categorySearchResults.length && categorySearchQuery.trim()">No se encontraron resultados para "{{ categorySearchQuery }}"</p>
                        </Main2>
                        <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                        <Main2>
                            <ProductCard3 v-for="product in products" :key="product.supplier_product_id" :product="product" />
                        </Main2>
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
                        <Main2 v-else>
                            <ProductCard3 v-for="product in subcategorySearchResults" :key="product.supplier_product_id" :product="product" />
                            <p v-if="!subcategorySearchResults.length && subcategorySearchQuery.trim()">No se encontraron resultados para "{{ subcategorySearchQuery }}"</p>
                        </Main2>
                        <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                        <Main2>
                            <ProductCard3 v-for="product in products" :key="product.supplier_product_id" :product="product" />
                        </Main2>
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
                            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" class="mb-4 text-lg font-medium leading-6 text-gray-900"> Agregar nuevo producto </DialogTitle>
                                <hr class="mb-4" />
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
