<script setup>
    import {ref, watch, defineEmits} from "vue";
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";
    import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/vue";
    import {ChevronUpIcon, PencilIcon} from "@heroicons/vue/20/solid";

    const props = defineProps({
        showModal: Boolean,
        product: Object,
        closeModal: Function,
    });

    const features = ref([]);
    const unitOfMeasures = ref([]);
    const selectedUnitOfMeasureId = ref(null);
    const price = ref(props.product?.price || 0);
    const showCreateUnitOfMeasureModal = ref(false);
    const isEditingPrice = ref(false);
    const isEditingUnit = ref(false);
    const isLoadingFeatures = ref(false);

    const fetchProductFeatures = async () => {
        isLoadingFeatures.value = true;
        try {
            const data = await fetchWithAuth(apiurl(`/supplier/producto/${props.product.id}/features`), "GET");
            features.value = data.features;
        } catch (error) {
            console.error("Error fetching product features:", error);
        } finally {
            isLoadingFeatures.value = false;
        }
    };

    const fetchUnitOfMeasures = async () => {
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/getunitofmeasures"), "GET");
            unitOfMeasures.value = response.data;

            if (unitOfMeasures.value.length > 0) {
                selectedUnitOfMeasureId.value = props.product?.unit_of_measure_id || unitOfMeasures.value[0].id;
            }
        } catch (error) {
            console.error("Error fetching unit of measures", error);
        }
    };

    const updateProductPrice = async () => {
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/update/price/${props.product.supplier_product_id}`), "PUT", {price: price.value});

            if (response.message === "Precio actualizado correctamente.") {
                isEditingPrice.value = false;
                props.closeModal();
                window.location.reload();
            } else {
                console.error("Error actualizando precio:", response.message);
            }
        } catch (error) {
            console.error("Error al actualizar el precio:", error);
        }
    };

    const updateProductUnitOfMeasure = async () => {
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/update/unit-of-measure/${props.product.supplier_product_id}`), "PUT", {
                unit_of_measure_id: selectedUnitOfMeasureId.value,
            });

            if (response.message === "Unidad de medida actualizada correctamente.") {
                isEditingUnit.value = false;
                props.closeModal();
                window.location.reload();
            } else {
                console.error("Error actualizando unidad de medida:", response.message);
            }
        } catch (error) {
            console.error("Error al actualizar la unidad de medida:", error);
        }
    };

    watch(
        () => props.showModal,
        (newValue) => {
            if (newValue) {
                fetchUnitOfMeasures();
                fetchProductFeatures();
                price.value = props.product?.price || 0;
                selectedUnitOfMeasureId.value = props.product?.unit_of_measure_id || null;
            }
        }
    );
</script>

<template>
    <TransitionRoot appear :show="showModal" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                        <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Vista del Producto</DialogTitle>
                            <hr class="mb-4" />
                            <div class="mt-2 flex flex-col md:flex-row">
                                <div class="mb-8 w-full md:w-1/3 md:pr-4">
                                    <img :src="product.photo" alt="product image" class="aspect-square size-full rounded-md object-cover" />
                                </div>

                                <div class="flex w-full flex-col gap-2 md:w-2/3">
                                    <div class="flex items-center">
                                        <p class="text-xl"><span class="font-bold">Nombre:</span> {{ product.name }}</p>
                                    </div>

                                    <div class="flex items-center">
                                        <p class="text-md"><span class="font-bold">Descripción:</span> {{ product.description }}</p>
                                    </div>

                                    <!-- Edit Price -->
                                    <div class="flex items-center">
                                        <p v-if="!isEditingPrice" class="text-md flex items-center">
                                            <span class="font-bold">Precio:</span> {{ product.price }} soles
                                            <button @click="isEditingPrice = true" class="ml-2 rounded-md border bg-gray-100 p-1 hover:bg-gray-200 hover:text-white">
                                                <Icon name="my-icon:pencil-simple" size="16" />
                                            </button>
                                        </p>
                                        <div v-else>
                                            <input type="number" v-model="price" class="ml-2 rounded-md border border-gray-300 px-2 py-1" />
                                            <button @click="updateProductPrice" class="ml-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Guardar</button>
                                            <button @click="isEditingPrice = false" class="ml-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cancelar</button>
                                        </div>
                                    </div>

                                    <!-- Edit Unit of Measure -->
                                    <div class="flex items-center">
                                        <p v-if="!isEditingUnit" class="text-md flex items-center">
                                            <span class="font-bold">Unidad:</span> {{ product.unit_of_measure }}
                                            <button @click="isEditingUnit = true" class="ml-2 rounded-md border bg-gray-100 p-1 hover:bg-gray-200 hover:text-white">
                                                <Icon name="my-icon:pencil-simple" size="16" />
                                            </button>
                                        </p>
                                        <div v-else>
                                            <UiLabel forId="unitofmeasure-select" text="Seleccione Unidad de Medida:" />
                                            <UiSelect id="unitofmeasure-select" v-model="selectedUnitOfMeasureId" :options="unitOfMeasures" required />
                                            <div @click="openCreateUnitOfMeasureModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                                                <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva unidad de medida</p>
                                            </div>
                                            <SupplierCreateUnitOfMeasure :showModal="showCreateUnitOfMeasureModal" :closeModal="closeCreateUnitOfMeasureModal" :onUnitOfMeasureCreated="handleUnitOfMeasureCreated" />
                                            <button @click="updateProductUnitOfMeasure" class="ml-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Guardar</button>
                                            <button @click="isEditingUnit = false" class="ml-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 flex items-center justify-between">
                                <h4 class="font-semibold">Características:</h4>
                            </div>

                            <div v-if="isLoadingFeatures" class="mt-4">Cargando características...</div>
                            <div v-else-if="features.length === 0" class="mt-4 text-gray-500">Este producto no tiene características.</div>
                            <ul v-else>
                                <li v-for="feature in features" :key="feature.id" class="mt-2">
                                    <Disclosure as="div" class="mt-2" v-slot="{open}">
                                        <DisclosureButton class="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75">
                                            <span>{{ feature.name }}: {{ feature.value }}</span>
                                            <Icon name="my-icon:caret-right" size="15" :class="['mx-2 transform transition-transform duration-300', open ? 'rotate-90' : 'rotate-0']" />
                                        </DisclosureButton>
                                        <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">{{ feature.description }}</DisclosurePanel>
                                    </Disclosure>
                                </li>
                            </ul>

                            <div class="mt-6 flex justify-end space-x-2">
                                <button @click="closeModal" class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cerrar</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
