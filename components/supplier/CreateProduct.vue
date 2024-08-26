<template>
    <div class="mb-4">
        <Label forId="" text="Imagen del Producto:" />
        <div
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @click="triggerFileInput"
            :class="{
                'flex h-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-200/20 p-6 hover:bg-gray-100': !file,
                'cursor-pointer rounded-md border-2 border-solid p-0': file,
            }">
            <div v-if="!file" class="flex flex-col items-center text-center">
                <p class="mt-2 text-sm font-semibold text-gray-600">Haz clic para subir o arrastra y suelta</p>
                <p class="text-xs text-gray-500">SVG, PNG, JPG o GIF (Formato cuadrado recomendable)</p>
            </div>
            <div v-if="file" class="relative flex h-80 w-full items-center justify-center">
                <img :src="preview" alt="Image Preview" class="max-h-full max-w-full rounded-lg object-contain shadow-md" />
            </div>
        </div>
        <div v-if="file" class="mt-2 flex justify-center gap-4">
            <button @click="removeImage" type="button" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400">Quitar imagen</button>
            <button @click="changeImage" type="button" class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400">Cambiar imagen</button>
        </div>
        <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" />
    </div>
    <div class="mb-4 grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
            <Label forId="name" text="Nombre del producto:" />
            <Input id="name" v-model="product.name" type="text" placeholder="Escribe el nombre del producto" required />
        </div>

        <div>
            <Label forId="price" text="Precio:" />
            <Input id="price" v-model="supplierProduct.price" type="number" placeholder="Escribe el precio" required />
        </div>

        <div>
            <Label forId="unitOfMeasure" text="Unidad de medida:" />
            <Input id="unitOfMeasure" v-model="supplierProduct.unitOfMeasure" type="text" placeholder="Unidad de medida" required />
        </div>

        <div>
            <Label forId="category-select" text="Seleccione Categoría:" />
            <select v-model="selectedCategoryId" id="category-select" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>

        <div v-if="selectedCategoryId && subcategories.length > 0">
            <Label forId="subcategory-select" text="Seleccione Subcategoría:" />
            <select v-model="selectedSubcategoryId" id="subcategory-select" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                    {{ subcategory.name }}
                </option>
            </select>
        </div>

        <div class="sm:col-span-2">
            <Label forId="description" text="Descripción:" />
            <textarea v-model="product.description" id="description" rows="4" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500" placeholder="Escribe la descripción del producto aquí"></textarea>
        </div>
    </div>

    <div class="mt-6 flex justify-end gap-2">
        <button type="button" class="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2" @click="closeModal">Cancelar</button>
        <button type="button" class="inline-flex justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2" @click="uploadImage">
            Guardar
        </button>
    </div>

    <p v-if="message" :class="{'text-green-500': isSuccess, 'text-red-500': !isSuccess}" class="mt-4">
        {{ message }}
    </p>
</template>
<script setup>
    import {ref, watch, onMounted} from "vue";
    import {v4 as uuidv4} from "uuid";
    import {fetchWithAuth, getUserId} from "@/services/auth";

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
    const supplierId = getUserId();

    const categories = ref([]);
    const subcategories = ref([]);
    const selectedCategoryId = ref(props.categoryId || "");
    const selectedSubcategoryId = ref(props.subcategoryId || "");

    const fetchCategories = async () => {
        try {
            const response = await fetchWithAuth("http://localhost:8000/api/supplier/misproductos/getcategories", "GET");

            categories.value = response.data;

            if (!props.categoryId && categories.value.length > 0) {
                selectedCategoryId.value = categories.value[0].id;
                fetchSubcategories(selectedCategoryId.value);
            }
        } catch (error) {
            console.error("Error al obtener categorías", error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/getsubcategoriesbycategory/${categoryId}`, "GET");

            subcategories.value = response.data;

            if (!props.subcategoryId && subcategories.value.length > 0) {
                selectedSubcategoryId.value = subcategories.value[0].id;
            }
        } catch (error) {
            console.error("Error al obtener subcategorías", error);
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
