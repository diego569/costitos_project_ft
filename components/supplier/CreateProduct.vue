<script setup>
    import {ref, watch, onMounted} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {uploadImage, createProduct, createSupplierProduct} from "@/services/productService";
    import {TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle} from "@headlessui/vue";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        categoryId: String,
        subcategoryId: String,
    });

    const product = ref({
        name: "",
        description: "",
        subcategoryId: props.subcategoryId || "",
    });

    const file = ref(null);
    const preview = ref(null);
    const message = ref("");
    const isSuccess = ref(false);

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
    const emit = defineEmits(["notify", "productAdded"]);

    const uploadImageHandler = async () => {
        try {
            const imageId = await uploadImage(file.value);
            const productId = await createProduct(product.value, selectedSubcategoryId.value, imageId);
            await createSupplierProduct(supplierProduct.value, productId, product.value.name);

            message.value = "Producto creado exitosamente!";
            isSuccess.value = true;

            emit("notify", {message: message.value, type: "success"});

            emit("productAdded");

            props.closeModal();

            product.value = {name: "", description: "", subcategoryId: ""};
            supplierProduct.value = {price: 0, unitOfMeasure: ""};
            file.value = null;
            preview.value = null;
        } catch (error) {
            message.value = error.message;
            isSuccess.value = false;

            emit("notify", {message: message.value, type: "error"});
        }
    };

    const showCreateCategoryModal = ref(false);

    const openCreateCategoryModal = () => {
        showCreateCategoryModal.value = true;
    };

    const closeCreateCategoryModal = () => {
        showCreateCategoryModal.value = false;
    };

    const handleCategoryCreated = (newCategory) => {
        categories.value.push(newCategory);
        selectedCategoryId.value = newCategory.id;
        fetchSubcategories(newCategory.id);
        console.log("Nueva categoría creada:", newCategory);
    };

    //
    const showCreateSubcategoryModal = ref(false);

    const openCreateSubcategoryModal = () => {
        showCreateSubcategoryModal.value = true;
    };

    const closeCreateSubcategoryModal = () => {
        showCreateSubcategoryModal.value = false;
    };

    const handleSubcategoryCreated = (newSubcategory) => {
        subcategories.value.push(newSubcategory);
        selectedSubcategoryId.value = newSubcategory.id;
    };

    const unitOfMeasures = [
        {value: "kg", label: "kg (Kilogramos)"},
        {value: "g", label: "g (Gramos)"},
        {value: "lb", label: "lb (Libras)"},
        {value: "oz", label: "oz (Onzas)"},
        {value: "L", label: "L (Litros)"},
        {value: "ml", label: "ml (Mililitros)"},
        {value: "gal", label: "gal (Galones)"},
        {value: "fl oz", label: "fl oz (Onzas líquidas)"},
        {value: "m", label: "m (Metros)"},
        {value: "cm", label: "cm (Centímetros)"},
        {value: "mm", label: "mm (Milímetros)"},
        {value: "in", label: "in (Pulgadas)"},
        {value: "ft", label: "ft (Pies)"},
        {value: "u", label: "u (Unidad)"},
        {value: "pkg", label: "pkg (Paquete)"},
        {value: "doz", label: "doz (Docena)"},
    ];

    const supplierProduct = ref({
        price: "",
        unitOfMeasure: unitOfMeasures[0].value,
    });
</script>
<template>
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
                                <div class="mb-4">
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
                                            <select v-model="supplierProduct.unitOfMeasure" id="unitOfMeasure" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                                <option v-for="unit in unitOfMeasures" :key="unit.value" :value="unit.value">
                                                    {{ unit.label }}
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label forId="category-select" text="Seleccione Categoría:" />
                                            <select v-model="selectedCategoryId" id="category-select" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                                    {{ category.name }}
                                                </option>
                                            </select>
                                            <div @click="openCreateCategoryModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                                                <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva categoría</p>
                                            </div>
                                            <SupplierCreateCategory :showModal="showCreateCategoryModal" :closeModal="closeCreateCategoryModal" :onCategoryCreated="handleCategoryCreated" />
                                        </div>

                                        <div v-if="selectedCategoryId && subcategories.length > 0">
                                            <Label forId="subcategory-select" text="Seleccione Subcategoría:" />
                                            <select v-model="selectedSubcategoryId" id="subcategory-select" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                                <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                                                    {{ subcategory.name }}
                                                </option>
                                            </select>
                                            <div @click="openCreateSubcategoryModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                                                <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva subcategoría</p>
                                            </div>
                                            <SupplierCreateSubcategory :showModal="showCreateSubcategoryModal" :closeModal="closeCreateSubcategoryModal" :categoryId="selectedCategoryId" :onSubcategoryCreated="handleSubcategoryCreated" />
                                        </div>
                                        <div v-if="selectedCategoryId && subcategories.length == 0">
                                            <div @click="openCreateSubcategoryModal" class="mt-2 flex h-full cursor-pointer items-center text-primary-600 hover:text-primary-800">
                                                <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva subcategoría</p>
                                            </div>
                                            <SupplierCreateSubcategory :showModal="showCreateSubcategoryModal" :closeModal="closeCreateSubcategoryModal" :categoryId="selectedCategoryId" :onSubcategoryCreated="handleSubcategoryCreated" />
                                        </div>
                                        <div class="sm:col-span-2">
                                            <Label forId="description" text="Descripción:" />
                                            <textarea
                                                v-model="product.description"
                                                id="description"
                                                rows="4"
                                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                                placeholder="Escribe la descripción del producto aquí"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                                    @click="closeModal">
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                                    @click="uploadImageHandler">
                                    Guardar
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
