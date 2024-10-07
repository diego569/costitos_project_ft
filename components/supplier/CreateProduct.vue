<script setup>
    import {ref, watch, onMounted} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {uploadImage, createProduct, createSupplierProduct} from "@/services/productService";
    import {apiurl} from "~/services/api.js";
    import {defineEmits} from "vue";
    import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/vue";

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
    const isLoading = ref(false);

    const categories = ref([]);
    const subcategories = ref([]);
    const selectedCategoryId = ref(props.categoryId || "");
    const selectedSubcategoryId = ref(props.subcategoryId || "");

    const unitOfMeasures = ref([]);
    const selectedUnitOfMeasureId = ref(null);

    const features = ref([]);
    const selectedFeatureId = ref("");
    const showCreateFeatureModal = ref(false);

    const featureValue = ref(""); // Asegúrate de definir correctamente featureValue
    // Variables para manejar características y valores
    const selectedFeatures = ref([{featureId: "", value: ""}]);
    const errorMessage = ref("");

    const fetchCategories = async () => {
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/getcategories"), "GET");
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
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/getsubcategoriesbycategory/${categoryId}`), "GET");
            subcategories.value = response.data;

            if (!props.subcategoryId && subcategories.value.length > 0) {
                selectedSubcategoryId.value = subcategories.value[0].id;
            }
        } catch (error) {
            console.error("Error al obtener subcategorías", error);
        }
    };

    const fetchUnitOfMeasures = async () => {
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/getunitofmeasures"), "GET");

            unitOfMeasures.value = response.data;

            if (unitOfMeasures.value.length > 0) {
                selectedUnitOfMeasureId.value = unitOfMeasures.value[0].id;
            }
        } catch (error) {
            console.error("Error al obtener unidades de medida", error);
        }
    };
    const fetchFeatures = async () => {
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/getfeatures"), "GET");
            features.value = response.data;

            if (!selectedFeatureId.value && features.value.length > 0) {
                selectedFeatureId.value = features.value[0].id;
            }
        } catch (error) {
            console.error("Error al obtener características", error);
        }
    };

    // Añadir nueva característica
    const addFeatureInput = () => {
        selectedFeatures.value.push({featureId: "", value: ""});
    };

    // Eliminar característica
    const removeFeatureInput = (index) => {
        selectedFeatures.value.splice(index, 1);
    };

    // Asignar características al producto
    const assignFeaturesToProduct = async (productId) => {
        try {
            isLoading.value = true;

            const validFeatures = selectedFeatures.value.filter((f) => f.featureId && f.value); // Validar entradas

            if (validFeatures.length === 0) {
                throw new Error("Debe seleccionar al menos una característica con valor.");
            }

            for (const feature of validFeatures) {
                await fetchWithAuth(apiurl("/supplier/misproductos/addfeaturetoproduct"), "POST", {
                    productId,
                    featureId: feature.featureId,
                    value: feature.value,
                });
            }

            console.log("Características asignadas con éxito");
        } catch (error) {
            console.error("Error al asignar características al producto:", error);
            errorMessage.value = "Error al asignar características";
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        fetchCategories();
        fetchUnitOfMeasures();
        fetchFeatures();
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
        if (!product.value.name || !product.value.description || !selectedUnitOfMeasureId.value) return;

        isLoading.value = true;
        try {
            const imageId = await uploadImage(file.value);
            const productId = await createProduct(product.value, selectedSubcategoryId.value, imageId);
            await createSupplierProduct(supplierProduct.value, productId, product.value.name, selectedUnitOfMeasureId.value);
            assignFeaturesToProduct(productId);
            message.value = "Producto creado exitosamente!";
            isSuccess.value = true;

            emit("notify", {message: message.value, type: "success"});
            emit("productAdded");

            props.closeModal();

            product.value = {name: "", description: "", subcategoryId: ""};
            supplierProduct.value = {price: 0};
            file.value = null;
            preview.value = null;
        } catch (error) {
            message.value = error.message;
            isSuccess.value = false;

            emit("notify", {message: message.value, type: "error"});
        } finally {
            isLoading.value = false;
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

    const supplierProduct = ref({
        price: "",
    });

    const showCreateUnitOfMeasureModal = ref(false);

    const openCreateUnitOfMeasureModal = () => {
        showCreateUnitOfMeasureModal.value = true;
    };

    const closeCreateUnitOfMeasureModal = () => {
        showCreateUnitOfMeasureModal.value = false;
    };

    const handleUnitOfMeasureCreated = (unitOfMeasure) => {
        unitOfMeasures.value.push(unitOfMeasure);
        selectedUnitOfMeasureId.value = unitOfMeasure.id;
    };

    const openCreateFeatureModal = () => {
        showCreateFeatureModal.value = true;
    };

    const closeCreateFeatureModal = () => {
        showCreateFeatureModal.value = false;
    };

    const handleFeatureCreated = (newFeature) => {
        features.value.push(newFeature);
        selectedFeatureId.value = newFeature.id;
    };
</script>
<template>
    <UiModal :showModal="showModal" :closeModal="closeModal" title="Agregar nuevo producto" size="lg">
        <div class="mt-2">
            <div class="mb-4">
                <UiLabel forId="" text="Imagen del Producto:" />
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
                    <UiLabel forId="name" text="Nombre del producto:" />
                    <UiInput id="name" v-model="product.name" type="text" placeholder="Escribe el nombre del producto" required />
                </div>

                <div>
                    <UiLabel forId="price" text="Precio:" />
                    <UiInput id="price" v-model="supplierProduct.price" type="text" placeholder="Escribe el precio" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');" required />
                </div>

                <div>
                    <UiLabel forId="unitofmeasure-select" text="Seleccione Unidad de Medida:" />
                    <UiSelect id="unitofmeasure-select" v-model="selectedUnitOfMeasureId" :options="unitOfMeasures" required />
                    <div @click="openCreateUnitOfMeasureModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                        <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva unidad de medida</p>
                    </div>
                    <SupplierCreateUnitOfMeasure :showModal="showCreateUnitOfMeasureModal" :closeModal="closeCreateUnitOfMeasureModal" :onUnitOfMeasureCreated="handleUnitOfMeasureCreated" />
                </div>

                <div>
                    <UiLabel forId="category-select" text="Seleccione Categoría:" />
                    <UiSelect id="category-select" v-model="selectedCategoryId" :options="categories" required />
                    <div @click="openCreateCategoryModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                        <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva categoría</p>
                    </div>
                    <SupplierCreateCategory :showModal="showCreateCategoryModal" :closeModal="closeCreateCategoryModal" :onCategoryCreated="handleCategoryCreated" />
                </div>

                <div v-if="selectedCategoryId && subcategories.length > 0">
                    <UiLabel forId="subcategory-select" text="Seleccione Subcategoría:" />
                    <UiSelect id="subcategory-select" v-model="selectedSubcategoryId" :options="subcategories" required />
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

                <div class="mt-8 sm:col-span-2">
                    <Disclosure>
                        <template #default="{open}">
                            <DisclosureButton class="mb-4 cursor-pointer text-lg font-semibold">
                                <span :class="{'font-medium': open, 'text-black': !open}">➤ Características(agregar)</span>
                            </DisclosureButton>

                            <DisclosurePanel>
                                <div v-for="(feature, index) in selectedFeatures" :key="index" class="mb-4 flex items-center space-x-4">
                                    <div class="flex-1">
                                        <UiLabel forId="feature-select" text="Seleccione Característica:" />
                                        <UiSelect id="feature-select" v-model="feature.featureId" :options="features" optionLabel="name" optionValue="id" placeholder="Selecciona una característica" required />
                                    </div>

                                    <div class="flex-1">
                                        <UiLabel forId="feature-value" text="Valor:" />
                                        <UiInput id="feature-value" v-model="feature.value" type="text" placeholder="Escribe el valor" required />
                                    </div>

                                    <div>
                                        <UiButton @click="removeFeatureInput(index)" variant="secondary" defaultText="Eliminar" />
                                    </div>
                                </div>

                                <div class="mt-2">
                                    <UiButton @click="addFeatureInput" variant="primary" defaultText="Agregar más características" />
                                </div>
                                <div @click="openCreateFeatureModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                                    <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva característica</p>
                                </div>
                            </DisclosurePanel>
                        </template>
                    </Disclosure>

                    <SupplierCreateFeature :showModal="showCreateFeatureModal" :closeModal="closeCreateFeatureModal" :onFeatureCreated="handleFeatureCreated" />
                </div>
                <div class="sm:col-span-2">
                    <UiLabel forId="description" text="Descripción:" />
                    <textarea v-model="product.description" id="description" rows="4" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500" placeholder="Escribe la descripción del producto aquí"></textarea>
                </div>
            </div>
        </div>

        <template #actions>
            <UiButton :type="'button'" :variant="'secondary'" :defaultText="'Cancelar'" @click="closeModal" />
            <UiButton :type="'button'" :variant="'primary'" :isLoading="isLoading" :loadingText="'Guardando...'" :defaultText="'Guardar'" @click="uploadImageHandler" />
        </template>
    </UiModal>
</template>
