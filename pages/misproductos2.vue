<template>
    <!-- Create Product with Image -->
    <button @click="openCombinedModal" class="mt-4 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Agregar producto</button>

    <!-- Combined Modal for Image Upload and Product Creation -->
    <div v-if="isCombinedModalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="mx-auto my-8 max-w-md rounded-lg bg-white p-6 text-center shadow-md">
            <h1 class="mb-4 text-2xl font-bold">Upload Image and Create Product</h1>
            <form @submit.prevent="handleSubmit">
                <!-- Image Upload Section -->
                <div class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6" @drop.prevent="handleDrop" @dragover.prevent="handleDragOver" @click="triggerFileInput">
                    <div v-if="!file" class="flex flex-col items-center">
                        <svg class="mb-3 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16v-4a4 4 0 018 0v4M5 20h14a2 2 0 002-2v-4a6 6 0 00-12 0v4a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="text-gray-500">Drag & Drop your files here or <span class="text-blue-500 underline">browse</span> to upload.</p>
                    </div>
                    <div v-if="file" class="mt-4">
                        <img :src="preview" alt="Image Preview" class="h-auto w-full rounded-lg shadow-md" />
                    </div>
                </div>
                <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" />

                <!-- Product Creation Section -->
                <input type="text" v-model="newProduct.name" placeholder="Product Name" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required />
                <textarea v-model="newProduct.description" placeholder="Description" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required></textarea>
                <select v-model="selectedCategoryId" @change="fetchSubcategories2" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required>
                    <option v-for="category in categories2" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
                <select v-model="newProduct.subcategoryId" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required>
                    <option v-for="subcategory in subcategories2" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
                </select>
                <input type="text" v-model="newProduct.status" placeholder="Status" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required />

                <button type="submit" class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Create</button>
            </form>
            <button @click="closeCombinedModal" class="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Close</button>
        </div>
    </div>
    <!-- <button @click="isModalOpen = true" class="mt-4 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Upload Image</button>
    <button @click="openCreateProductModal" class="mt-4 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Create Product</button> -->

    <!-- Create Product Modal -->
    <div v-if="isCreateProductModalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="mx-auto my-8 max-w-md rounded-lg bg-white p-6 text-center shadow-md">
            <h1 class="mb-4 text-2xl font-bold">Create Product</h1>
            <form @submit.prevent="createProduct">
                <input type="text" v-model="newProduct.name" placeholder="Product Name" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required />
                <textarea v-model="newProduct.description" placeholder="Description" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required></textarea>
                <select v-model="selectedCategoryId" @change="fetchSubcategories2" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required>
                    <option v-for="category in categories2" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
                <select v-model="newProduct.subcategoryId" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required>
                    <option v-for="subcategory in subcategories2" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
                </select>
                <input type="text" v-model="newProduct.status" placeholder="Status" class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" required />
                <button type="submit" class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Create</button>
            </form>
            <button @click="closeCreateProductModal" class="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Close</button>
        </div>
    </div>
    <div class="mx-auto max-w-screen-xl px-2 py-2 md:py-5">
        <input type="text" v-model="searchQuery" placeholder="Buscar productos..." class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2" />

        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
            <div class="max-h-[calc(100vh_-_180px)] min-h-20 overflow-auto rounded-lg border border-gray-100 bg-gray-200 p-2">
                <!-- Show All Products Button -->
                <button @click="showAll" :class="{'bg-orange-500 text-white': showAllProducts, 'bg-gray-200 text-gray-700': !showAllProducts}" class="mb-4 w-full rounded-md px-4 py-2 text-left">Mostrar Todos</button>

                <div>
                    <div v-for="category in categories" :key="category.id" class="mb-2">
                        <div
                            :class="{'bg-primary-400': selectedCategory && selectedCategory.id === category.id}"
                            class="flex h-14 cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-primary-200"
                            @click="selectCategory(category)">
                            <span>{{ category.name }}</span>
                            <span v-if="selectedCategory && selectedCategory.id === category.id" class="ml-2 text-primary-800">▼</span>
                            <span v-else class="text-white-500 ml-2">►</span>
                        </div>
                        <div v-if="selectedCategory && selectedCategory.id === category.id" class="pl-4 pt-3">
                            <div v-for="subcategory in subcategories" :key="subcategory.id" class="pl-4">
                                <button
                                    @click="selectSubcategory(subcategory)"
                                    :class="{'bg-orange-500 text-white': selectedSubcategory && selectedSubcategory.id === subcategory.id, 'bg-gray-200 text-gray-700 hover:bg-primary-50': !selectedSubcategory || selectedSubcategory.id !== subcategory.id}"
                                    class="mb-2 w-full rounded-md bg-gray-50 px-4 py-2 text-left">
                                    {{ subcategory.name }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden h-full max-h-[calc(100vh_-_180px)] min-h-20 overflow-auto rounded-lg border border-gray-100 bg-gray-200 p-2 lg:col-span-2 lg:block">
                <!-- <h2 class="mb-4 text-xl font-bold">
                    Estas en
                    <span v-if="selectedCategory">{{ selectedCategory.name }}</span>
                    <span v-else>TODOS</span>
                    <span v-if="selectedSubcategory"> > {{ selectedSubcategory.name }}</span>
                </h2> -->

                <!-- Products List -->
                <div v-if="products.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div v-for="product in products" :key="product.id" class="relative overflow-hidden rounded-lg bg-white shadow-md">
                        <img :src="product.photo" :alt="product.name" class="h-48 w-full object-cover" />
                        <div class="absolute left-0 top-0 rounded-br-lg bg-white bg-opacity-75 p-2">
                            {{ product.unitOfMeasure }}
                        </div>
                        <div class="absolute right-0 top-0 flex space-x-2 p-2">
                            <button @click="openModal(product)" class="rounded-full bg-blue-500 p-2 text-white">
                                <i class="fas fa-upload"></i>
                            </button>
                            <button @click="deleteProduct(product.id)" class="rounded-full bg-red-500 p-2 text-white">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="p-4">
                            <h2 class="text-xl font-semibold">{{ product.name }}</h2>
                            <p class="text-gray-600">{{ product.description }}</p>
                            <p class="font-bold text-gray-600">Price: ${{ product.price }} / {{ product.unitOfMeasure }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-gray-500">No hay productos.</div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="mx-auto my-8 max-w-md rounded-lg bg-white p-6 text-center shadow-md">
                <h1 class="mb-4 text-2xl font-bold">File Upload</h1>
                <div class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6" @drop.prevent="handleDrop" @dragover.prevent="handleDragOver" @click="triggerFileInput">
                    <div v-if="!file" class="flex flex-col items-center">
                        <svg class="mb-3 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16v-4a4 4 0 018 0v4M5 20h14a2 2 0 002-2v-4a6 6 0 00-12 0v4a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="text-gray-500">Drag & Drop your files here or <span class="text-blue-500 underline">browse</span> to upload.</p>
                    </div>
                    <div v-if="file" class="mt-4">
                        <img :src="preview" alt="Image Preview" class="h-auto w-full rounded-lg shadow-md" />
                    </div>
                </div>
                <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" />
                <button @click="uploadImage" :disabled="!file" class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Upload</button>
                <p v-if="message" :class="{'text-green-500': isSuccess, 'text-red-500': !isSuccess}" class="mt-4">
                    {{ message }}
                </p>
                <button @click="closeModal" class="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted, watch} from "vue";

    const userId = ref(null);
    const products = ref([]);
    const categories = ref([]);
    const subcategories = ref([]);
    const selectedCategory = ref(null);
    const selectedSubcategory = ref(null);
    const showAllProducts = ref(true);
    const searchQuery = ref("");
    const isModalOpen = ref(false);
    // const file = ref(null);
    // const preview = ref(null);
    // const message = ref("");
    // const isSuccess = ref(false);

    const isLocalStorageAvailable = () => {
        try {
            const test = "__storage_test__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    const loadUserData = () => {
        if (isLocalStorageAvailable()) {
            const userData = JSON.parse(localStorage.getItem("userData")) || {};
            userId.value = userData.id;
        }
    };

    const fetchCategories = async () => {
        try {
            if (!userId.value) return;

            const response = await fetch(`http://localhost:8000/api/categories/bySupplier/${userId.value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            categories.value = data.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            if (!userId.value || !categoryId) return;

            const response = await fetch(`http://localhost:8000/api/categories/${categoryId}/subcategories/bySupplier/${userId.value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            subcategories.value = data.data;
            selectedSubcategory.value = null;
            products.value = [];
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };
    const fetchProductsBySubcategory = async (subcategoryId) => {
        try {
            if (!userId.value || !subcategoryId) return;

            const response = await fetch(`http://localhost:8000/api/subcategories/${subcategoryId}/products/bySupplier/${userId.value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            products.value = data.data;
            showAllProducts.value = false;
        } catch (error) {
            console.error("Error fetching products by subcategory:", error);
        }
    };

    const fetchAllProducts = async () => {
        try {
            if (!userId.value) return;

            const response = await fetch(`http://localhost:8000/api/products/bySupplier/${userId.value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            products.value = data.data;
            showAllProducts.value = true;
        } catch (error) {
            console.error("Error fetching all products:", error);
        }
    };

    const searchProducts = async () => {
        try {
            if (!userId.value) return;

            let url = `http://localhost:8000/api/products/search/${userId.value}?query=${searchQuery.value}`;
            if (selectedSubcategory.value) {
                url = `http://localhost:8000/api/subcategories/${selectedSubcategory.value.id}/products/search/${userId.value}?query=${searchQuery.value}`;
            } else if (selectedCategory.value) {
                url = `http://localhost:8000/api/categories/${selectedCategory.value.id}/products/search/${userId.value}?query=${searchQuery.value}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            products.value = data.data;
        } catch (error) {
            console.error("Error searching products:", error);
        }
    };

    const selectCategory = async (category) => {
        selectedCategory.value = category;
        await fetchSubcategories(category.id);
    };

    const selectSubcategory = (subcategory) => {
        selectedSubcategory.value = subcategory;
        fetchProductsBySubcategory(subcategory.id);
    };

    const showAll = () => {
        selectedCategory.value = null;
        selectedSubcategory.value = null;
        fetchAllProducts();
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Refresh products list after deletion
            if (selectedSubcategory.value) {
                fetchProductsBySubcategory(selectedSubcategory.value.id);
            } else if (selectedCategory.value) {
                fetchSubcategories(selectedCategory.value.id);
            } else {
                fetchAllProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Watch for changes in the search query and trigger the search
    watch(searchQuery, (newQuery) => {
        searchProducts();
    });

    // Lifecycle hook - fetch categories and all products when component is mounted
    onMounted(() => {
        loadUserData();
        if (userId.value) {
            fetchCategories();
            fetchAllProducts();
        }
    });

    // // Image upload modal functions
    // const handleFileChange = (event) => {
    //     const selectedFile = event.target.files[0];
    //     if (selectedFile) {
    //         file.value = selectedFile;
    //         preview.value = URL.createObjectURL(selectedFile);
    //     }
    // };

    // const handleDrop = (event) => {
    //     const droppedFile = event.dataTransfer.files[0];
    //     if (droppedFile) {
    //         file.value = droppedFile;
    //         preview.value = URL.createObjectURL(droppedFile);
    //     }
    // };

    // const handleDragOver = (event) => {
    //     event.dataTransfer.dropEffect = "copy";
    // };

    // const triggerFileInput = () => {
    //     document.querySelector('input[type="file"]').click();
    // };
    // const uploadedFileId = ref(null);

    // const uploadImage = async () => {
    //     if (!file.value) {
    //         message.value = "Please select a file.";
    //         isSuccess.value = false;
    //         return;
    //     }

    //     let formData = new FormData();
    //     formData.append("myfile", file.value);

    //     try {
    //         const response = await fetch("http://localhost:8000/api/uploadimage", {
    //             method: "POST",
    //             body: formData,
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log(data); // Log the response data to the console
    //             uploadedFileId.value = data.data.id; // Store the id in the variable
    //             message.value = "Image uploaded successfully!";
    //             isSuccess.value = true;
    //             console.log("id retorno xd: ", uploadedFileId.value);
    //         } else {
    //             message.value = "Failed to upload image.";
    //             isSuccess.value = false;
    //         }
    //     } catch (error) {
    //         message.value = "Error uploading image.";
    //         isSuccess.value = false;
    //         console.error(error); // Log the error to the console
    //     }
    // };

    const openModal = (product) => {
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        file.value = null;
        preview.value = null;
        message.value = "";
    };

    // preate a product test

    // const isCreateProductModalOpen = ref(false);
    // const categories2 = ref([]);
    // const subcategories2 = ref([]);
    // const selectedCategoryId = ref(null);
    // const newProduct = ref({
    //     name: "",
    //     description: "",
    //     subcategoryId: null,
    //     status: "",
    //     supplierId: "7915b4e7-13a2-4951-8a74-e3e36247e7dc", // Example supplierId, replace as needed
    //     adminAuthorizedId: null,
    //     creationDate: new Date().toISOString(),
    //     authorizationDate: null,
    // });

    // const openCreateProductModal = () => {
    //     isCreateProductModalOpen.value = true;
    //     fetchCategories2();
    // };

    // const closeCreateProductModal = () => {
    //     isCreateProductModalOpen.value = false;
    // };

    // const fetchCategories2 = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8000/api/category/all");
    //         categories2.value = await response.json();
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //     }
    // };

    // const fetchSubcategories2 = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8000/api/subcategory/byCategoryId/${selectedCategoryId.value}`);
    //         const responseData = await response.json();

    //         subcategories2.value = responseData.data || [];
    //         // If responseData.data is undefined or null, subcategories2.value will be an empty array ([]).
    //     } catch (error) {
    //         console.error("Error fetching subcategories:", error);
    //     }
    // };

    // const createProduct = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8000/api/product/create", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(newProduct.value),
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log("Product created:", data);
    //             closeCreateProductModal();
    //             // Optionally, refresh the products list
    //         } else {
    //             console.error("Failed to create product");
    //         }
    //     } catch (error) {
    //         console.error("Error creating product:", error);
    //     }
    // };

    // onMounted(fetchCategories2);

    // ------------------------=---=-===-==--==--==--==-

    const isCombinedModalOpen = ref(false);
    const categories2 = ref([]);
    const subcategories2 = ref([]);
    const selectedCategoryId = ref(null);
    const newProduct = ref({
        name: "",
        description: "",
        subcategoryId: null,
        status: "",
        supplierId: userId.value, // Example supplierId, replace as needed
        adminAuthorizedId: null,
        creationDate: new Date().toISOString(),
        authorizationDate: null,
    });

    const file = ref(null);
    const preview = ref(null);
    const message = ref("");
    const isSuccess = ref(false);
    const uploadedFileId = ref(null);

    const openCombinedModal = () => {
        isCombinedModalOpen.value = true;
        fetchCategories2();
    };

    const closeCombinedModal = () => {
        isCombinedModalOpen.value = false;
        file.value = null;
        preview.value = null;
        message.value = "";
    };

    const fetchCategories2 = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/category/all");
            categories2.value = await response.json();
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubcategories2 = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/subcategory/byCategoryId/${selectedCategoryId.value}`);
            const responseData = await response.json();
            subcategories2.value = responseData.data || [];
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            file.value = selectedFile;
            preview.value = URL.createObjectURL(selectedFile);
        }
    };

    const handleDrop = (event) => {
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            file.value = droppedFile;
            preview.value = URL.createObjectURL(droppedFile);
        }
    };

    const handleDragOver = (event) => {
        event.dataTransfer.dropEffect = "copy";
    };

    const triggerFileInput = () => {
        document.querySelector('input[type="file"]').click();
    };

    const uploadImage = async () => {
        if (!file.value) {
            message.value = "Please select a file.";
            isSuccess.value = false;
            return false;
        }

        let formData = new FormData();
        formData.append("myfile", file.value);

        try {
            console.log("Uploading image with data:", formData); // Add this line
            const response = await fetch("http://localhost:8000/api/uploadimage", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                uploadedFileId.value = data.data.id;
                message.value = "Image uploaded successfully!";
                isSuccess.value = true;
                return true;
            } else {
                message.value = "Failed to upload image.";
                isSuccess.value = false;
                return false;
            }
        } catch (error) {
            message.value = "Error uploading image.";
            isSuccess.value = false;
            console.error(error);
            return false;
        }
    };

    const createProduct = async () => {
        newProduct.value.imageId = uploadedFileId.value; // Assign the uploaded image ID to the product
        console.log("Creating product with data:", newProduct); // Add this line
        try {
            const response = await fetch("http://localhost:8000/api/product/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct.value),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Product created:", data);
                closeCombinedModal();
                return true;
            } else {
                console.error("Failed to create product");
                return false;
            }
        } catch (error) {
            console.error("Error creating product:", error);
            return false;
        }
    };
    const handleSubmit = async () => {
        const imageUploaded = await uploadImage();
        if (imageUploaded) {
            await createProduct();
        }
    };

    onMounted(fetchCategories2);
</script>
