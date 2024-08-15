<template>
    <div class="flex flex-col gap-3 text-center">
        <div class=" ">
            <div @drop.prevent="handleDrop" @dragover.prevent="handleDragOver" :class="{'flex h-40 items-center justify-center border-2 border-dashed border-gray-300 p-3': !file, 'border-none': file}">
                <div v-if="!file" class="flex flex-col items-center">
                    <button @click="triggerFileInput" type="button" class="w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Cargar imagen</button>
                    <p class="text-gray-600">O arrastre y suelte el archivo aquí</p>
                </div>
                <div v-if="file" class="relative">
                    <img :src="preview" alt="Image Preview" class="h-auto w-full rounded-lg shadow-md" />
                    <button @click="removeImage" type="button" class="absolute left-2 top-2 rounded-full bg-red-600 p-2 text-white shadow-md hover:bg-red-500 focus:outline-none">X</button>
                    <button @click="changeImage" type="button" class="absolute right-2 top-2 rounded-full bg-gray-800 p-2 text-white shadow-md hover:bg-gray-700 focus:outline-none">Cambiar imagen</button>
                </div>
            </div>
            <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" />
        </div>
        <div class=" ">
            <label for="category-select" class="block text-left text-gray-700">Seleccione Categoría:</label>
            <select v-model="selectedCategoryId" id="category-select" class="w-full rounded-lg border p-2" :disabled="!!props.categoryId">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>
        <div v-if="selectedCategoryId && subcategories.length > 0" class=" ">
            <label for="subcategory-select" class="block text-left text-gray-700">Seleccione Subcategoría:</label>
            <select v-model="selectedSubcategoryId" id="subcategory-select" class="w-full rounded-lg border p-2" :disabled="!!props.subcategoryId">
                <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                    {{ subcategory.name }}
                </option>
            </select>
        </div>
        <div class=" ">
            <label for="name" class="block text-left text-gray-700">Nombre del producto:</label>
            <input v-model="product.name" type="text" id="name" required class="w-full rounded-lg border p-2" />
        </div>
        <div class=" ">
            <label for="description" class="block text-left text-gray-700">Descripción:</label>
            <textarea v-model="product.description" id="description" required class="w-full rounded-lg border p-2"></textarea>
        </div>
        <div class="flex gap-3">
            <div class="w-full">
                <label for="price" class="block text-left text-gray-700">Precio:</label>
                <input v-model="supplierProduct.price" type="number" id="price" required class="w-full rounded-lg border p-2" />
            </div>
            <div class="w-full">
                <label for="unitOfMeasure" class="block text-left text-gray-700">Unidad de medida:</label>
                <input v-model="supplierProduct.unitOfMeasure" type="text" id="unitOfMeasure" required class="w-full rounded-lg border p-2" />
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <button type="button" class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" @click="closeModal">Cancelar</button>
            <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                @click="uploadImage">
                Guardar
            </button>
        </div>

        <p v-if="message" :class="{'text-green-500': isSuccess, 'text-red-500': !isSuccess}" class="mt-4">
            {{ message }}
        </p>
    </div>
</template>
<script setup>
    import {ref, watch, onMounted} from "vue";
    import {v4 as uuidv4} from "uuid";

    const props = defineProps({
        categoryId: String,
        subcategoryId: String,
        closeModal: Function,
    });

    const product = ref({
        name: "",
        description: "",
        subcategoryId: props.subcategoryId || "",
    });
    const supplierProduct = ref({
        price: 0,
        unitOfMeasure: "",
    });
    const file = ref(null);
    const preview = ref(null);
    const message = ref("");
    const isSuccess = ref(false);
    const supplierId = "92c05463-e920-4153-bc38-5c6352701769";

    const categories = ref([]);
    const subcategories = ref([]);
    const selectedCategoryId = ref(props.categoryId || "");
    const selectedSubcategoryId = ref(props.subcategoryId || "");

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/supplier/misproductos/getcategories");
            if (!response.ok) throw new Error("Error al obtener categorías");

            const data = await response.json();
            categories.value = data.data;

            if (!props.categoryId && categories.value.length > 0) {
                selectedCategoryId.value = categories.value[0].id;
                fetchSubcategories(selectedCategoryId.value);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/supplier/misproductos/getsubcategoriesbycategory/${categoryId}`);
            if (!response.ok) throw new Error("Error al obtener subcategorías");

            const data = await response.json();
            subcategories.value = data.data;

            if (!props.subcategoryId && subcategories.value.length > 0) {
                selectedSubcategoryId.value = subcategories.value[0].id;
            }
        } catch (error) {
            console.error(error);
        }
    };

    onMounted(() => {
        fetchCategories();

        if (props.categoryId) {
            fetchSubcategories(props.categoryId);
        }
    });

    watch(selectedCategoryId, (newVal) => {
        if (newVal && !props.categoryId) {
            fetchSubcategories(newVal);
        }
    });

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

    const changeImage = () => {
        triggerFileInput();
    };

    const removeImage = () => {
        file.value = null;
        preview.value = null;
    };

    const uploadImage = async () => {
        if (!file.value) {
            message.value = "Por favor seleccione un archivo.";
            isSuccess.value = false;
            return;
        }

        const formData = new FormData();
        formData.append("myfile", file.value);

        try {
            const response = await fetch("http://localhost:8000/api/supplier/crear/uploadimage", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                createProduct(data.id);
            } else {
                message.value = "Error al subir la imagen.";
                isSuccess.value = false;
                return null;
            }
        } catch (error) {
            message.value = "Error al subir la imagen.";
            isSuccess.value = false;
            return null;
        }
    };

    const createProduct = async (imageId) => {
        const productData = {
            id: uuidv4(),
            name: product.value.name,
            description: product.value.description,
            imageId: imageId,
            subcategoryId: selectedSubcategoryId.value || product.value.subcategoryId,
            supplierId: supplierId,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            const response = await fetch("http://localhost:8000/api/supplier/crear/createproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                const data = await response.json();
                createSupplierProduct(data.id);
            } else {
                message.value = "Error al crear el producto.";
                isSuccess.value = false;
            }
        } catch (error) {
            message.value = "Error al crear el producto.";
            isSuccess.value = false;
        }
    };

    const createSupplierProduct = async (productId) => {
        const supplierProductData = {
            id: uuidv4(),
            supplierId: supplierId,
            productId: productId,
            productName: product.value.name,
            price: supplierProduct.value.price,
            unitOfMeasure: supplierProduct.value.unitOfMeasure,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            const response = await fetch("http://localhost:8000/api/supplier/crear/createsupplierproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(supplierProductData),
            });

            if (response.ok) {
                message.value = "Producto creado exitosamente!";
                isSuccess.value = true;
                product.value = {name: "", description: "", subcategoryId: ""};
                supplierProduct.value = {price: 0, unitOfMeasure: ""};
                file.value = null;
                preview.value = null;
            } else {
                message.value = "Error al crear el producto.";
                isSuccess.value = false;
            }
        } catch (error) {
            message.value = "Error al crear el producto.";
            isSuccess.value = false;
        }
    };
</script>
