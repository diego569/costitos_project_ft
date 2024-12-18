<script setup>
    import {ref, onMounted} from "vue";
    import {getUserId} from "@/services/auth";
    import {apiurl} from "@/services/api.js";
    import {defaultData} from "@/services/defaults.js";
    import Cotizacion from "~/components/Cotizacion.vue";

    const projects = ref([]);
    const searchQuery = ref("");
    const areas = ref([]);
    const quotations = ref([]);

    const selectedProject = ref(defaultData.project);
    const selectedArea = ref(defaultData.area);

    const showModalCreate = ref(false);
    const showModalEdit = ref(false);
    const showModalDelete = ref(false);
    const showModalAddArea = ref(false);

    const isLoadingProjects = ref(false);
    const isLoadingAreas = ref(false);
    const isLoadingQuotations = ref(false);
    const isCreating = ref(false);
    const isUpdating = ref(false);
    const isDeleting = ref(false);
    const isAddingArea = ref(false);

    const newProject = ref({name: "", unifiedCode: ""});
    const newArea = ref({type: "", structureId: ""});

    const errorProjects = ref("");
    const errorAreas = ref("");
    const errorQuotations = ref("");

    const userId = getUserId();
    const quotationIds = ref([]);

    const searchProjects = async () => {
        const query = searchQuery.value.trim();
        if (!query) {
            fetchUserProjects();
            return;
        }
        try {
            isLoadingProjects.value = true;
            const response = await fetch(apiurl(`/user/proyectos/buscar/${userId}?query=${encodeURIComponent(query)}`));
            if (!response.ok) throw new Error("Error al buscar proyectos.");
            const data = await response.json();
            projects.value = data.data;
            if (projects.value.length > 0) {
                selectedProject.value = projects.value.find((project) => project.name === "Sin asignar") || projects.value[0];
                fetchProjectAreas(selectedProject.value.id);
            } else {
                selectedProject.value = null;
                areas.value = [];
                quotations.value = [];
            }
        } catch (err) {
            console.error(err);
            errorProjects.value = "Error al buscar proyectos.";
        } finally {
            isLoadingProjects.value = false;
        }
    };

    const fetchUserProjects = async () => {
        try {
            isLoadingProjects.value = true;
            const response = await fetch(apiurl(`/user/proyectos/${userId}`));
            if (!response.ok) throw new Error("No se pudieron obtener los proyectos.");
            const data = await response.json();
            projects.value = data.data;
            if (projects.value.length > 0) {
                selectedProject.value = projects.value.find((project) => project.name === "Sin asignar") || projects.value[0];
                fetchProjectAreas(selectedProject.value.id);
            }
        } catch (err) {
            console.error(err);
            errorProjects.value = "Error al cargar los proyectos.";
        } finally {
            isLoadingProjects.value = false;
        }
    };

    const fetchProjectAreas = async (structureId) => {
        try {
            isLoadingAreas.value = true;
            areas.value = [];
            quotationIds.value = [];
            errorAreas.value = "";

            const response = await fetch(apiurl(`/user/proyectos/${structureId}/areas`));
            if (!response.ok) throw new Error("No se pudieron obtener las áreas.");
            const data = await response.json();
            areas.value = await Promise.all(
                data.data.map(async (area) => {
                    const areaQuotations = await fetchQuotationsByArea(area.id);

                    areaQuotations.forEach((quotation) => {
                        if (!quotationIds.value.includes(quotation.id)) {
                            quotationIds.value.push(quotation.id);
                        }
                    });

                    return {...area, quotations: areaQuotations};
                })
            );

            if (areas.value.length > 0) {
                selectedArea.value = areas.value.find((area) => area.type === "Sin asignar") || areas.value[0];
                quotations.value = selectedArea.value.quotations;

                quotationIds.value = selectedArea.value.quotations.map((q) => q.id);
            }
        } catch (err) {
            console.error(err);
            errorAreas.value = "Error al cargar las áreas.";
        } finally {
            isLoadingAreas.value = false;
        }
    };

    const fetchQuotationsByArea = async (areaId) => {
        try {
            isLoadingQuotations.value = true;
            const response = await fetch(apiurl(`/user/proyectos/areas/${areaId}/cotizaciones`));
            if (!response.ok) throw new Error("No se pudieron obtener las cotizaciones.");
            const data = await response.json();
            return data.data;
        } catch (err) {
            console.error(err);
            errorQuotations.value = "Error al cargar las cotizaciones.";
            return [];
        } finally {
            isLoadingQuotations.value = false;
        }
    };

    const selectArea = (area) => {
        selectedArea.value = area;
        quotations.value = area.quotations;

        quotationIds.value = area.quotations.map((q) => q.id);
    };
    const selectProject = (project) => {
        if (selectedProject.value?.id === project.id) {
            selectedProject.value = null;
            areas.value = [];
            quotations.value = [];
        } else {
            selectedProject.value = project;
            fetchProjectAreas(project.id);
        }
    };

    const createProject = async () => {
        try {
            isCreating.value = true;

            const response = await fetch(apiurl("/user/proyectos/crear/proyecto"), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...newProject.value, userId}),
            });

            if (!response.ok) throw new Error("No se pudo crear el proyecto.");

            const data = await response.json();

            selectedProject.value = data.data;

            if (selectedProject.value?.id) {
                await fetchProjectAreas(selectedProject.value.id);
            }

            await fetchUserProjects();

            closeCreateModal();
        } catch (err) {
            console.error(err);
            alert("Error al crear el proyecto.");
        } finally {
            isCreating.value = false;
        }
    };

    const updateProject = async () => {
        try {
            isUpdating.value = true;
            const response = await fetch(apiurl(`/user/proyectos/${selectedProject.value.id}/editar`), {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(selectedProject.value),
            });
            if (!response.ok) throw new Error("No se pudo actualizar el proyecto.");
            const data = await response.json();
            const index = projects.value.findIndex((p) => p.id === selectedProject.value.id);
            projects.value[index] = data.data;
            closeEditModal();
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el proyecto.");
        } finally {
            isUpdating.value = false;
        }
    };

    const deleteProject = async () => {
        try {
            isDeleting.value = true;
            const response = await fetch(apiurl(`/user/proyectos/${selectedProject.value.id}/eliminar`), {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("No se pudo eliminar el proyecto.");
            projects.value = projects.value.filter((p) => p.id !== selectedProject.value.id);
            closeDeleteModal();
        } catch (err) {
            console.error(err);
            alert("Error al eliminar el proyecto.");
        } finally {
            isDeleting.value = false;
        }
    };

    const addArea = async () => {
        try {
            if (!newArea.value.type) {
                alert("El campo 'Tipo' es obligatorio.");
                return;
            }
            isAddingArea.value = true;

            const response = await fetch(apiurl(`/user/proyectos/${selectedProject.value.id}/areas/agregar`), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({type: newArea.value.type}),
            });

            if (!response.ok) throw new Error("No se pudo agregar el área.");

            const data = await response.json();

            const newAreaWithQuotations = {...data.data, quotations: []};
            areas.value.push(newAreaWithQuotations);

            selectedArea.value = newAreaWithQuotations;
            quotations.value = newAreaWithQuotations.quotations;

            closeAddAreaModal();
        } catch (err) {
            console.error(err);
            alert("Error al agregar el área.");
        } finally {
            isAddingArea.value = false;
        }
    };

    const updateQuotationProject = async (quotationId, projectId) => {
        try {
            const response = await fetch(apiurl(`/user/proyectos/${quotationId}/project`), {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({projectId}),
            });

            if (!response.ok) throw new Error("No se pudo actualizar el proyecto de la cotización.");

            const data = await response.json();
            if (data.success) {
                window.location.reload();
            }
        } catch (err) {
            console.error("Error al actualizar el proyecto de la cotización:", err);
        }
    };

    const updateQuotationArea = async (quotationId, areaId) => {
        try {
            const response = await fetch(apiurl(`/user/proyectos/${quotationId}/area`), {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({areaId}),
            });

            if (!response.ok) throw new Error("No se pudo actualizar el área de la cotización.");

            const data = await response.json();
            if (data.success) {
                console.log("El área de la cotización se ha actualizado con éxito.");

                if (selectedProject.value) {
                    await fetchProjectAreas(selectedProject.value.id);
                    selectedArea.value = areas.value.find((area) => area.id === areaId) || null;
                    quotations.value = selectedArea.value ? selectedArea.value.quotations : [];
                }
            } else {
                console.log(data.message || "Ocurrió un error al actualizar el área.");
            }
        } catch (err) {
            console.error("Error al actualizar el área de la cotización:", err);
            alert("Error al actualizar el área de la cotización.");
        }
    };
    const openCreateModal = () => (showModalCreate.value = true);
    const closeCreateModal = () => {
        showModalCreate.value = false;
        newProject.value = {name: "", unifiedCode: ""};
    };
    const openAddAreaModal = () => {
        if (!selectedProject.value) {
            alert("Primero seleccione un proyecto.");
            return;
        }
        newArea.value = {type: "", structureId: selectedProject.value.id};
        showModalAddArea.value = true;
    };
    const closeAddAreaModal = () => (showModalAddArea.value = false);
    const openEditModal = (project) => {
        selectedProject.value = {...project};
        showModalEdit.value = true;
    };
    const closeEditModal = () => (showModalEdit.value = false);
    const openDeleteModal = (project) => {
        selectedProject.value = {...project};
        showModalDelete.value = true;
    };
    const closeDeleteModal = () => (showModalDelete.value = false);

    onMounted(async () => {
        await fetchUserProjects();
        if (projects.value.length > 0) {
            selectedProject.value = projects.value[0];
            await fetchProjectAreas(selectedProject.value.id);
        } else {
            selectedProject.value = defaultData.project;
            areas.value = [];
            quotations.value = [];
        }
    });
</script>
<template>
    <div class="flex min-h-screen">
        <aside class="w-2/8 border-r bg-white">
            <div class="flex items-center justify-between p-4">
                <h2 class="text-lg font-bold text-gray-700">Mis Proyectos</h2>
                <button @click="openCreateModal" class="flex justify-center rounded-lg px-3 py-2 text-center text-sm hover:bg-gray-200 hover:text-gray-500">
                    <Icon name="my-icon:baseline-plus" size="15" />
                </button>
            </div>
            <div class="mb-4 px-4">
                <input v-model="searchQuery" @input="searchProjects" type="text" placeholder="Buscar por nombre o CUI" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <ul>
                <li
                    v-for="project in projects"
                    :key="project.id"
                    :class="{
                        'bg-gray-200': selectedProject?.id === project.id,
                        ' ': selectedProject?.id !== project.id,
                    }"
                    class="group relative flex items-center justify-between p-4 hover:bg-gray-100"
                    @click="selectProject(project)">
                    <div>
                        <div v-if="project.name === 'Sin asignar'" class="flex items-center">
                            <h3 class="flex items-center font-semibold text-gray-800">
                                <Icon name="my-icon:overview" size="22" class="mr-2 flex-shrink-0" />
                                Mis Cotizaciones
                            </h3>
                        </div>
                        <div v-else class="flex items-center">
                            <div class="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center">
                                <Icon name="my-icon:gear" size="30" />
                            </div>
                            <div class="flex flex-col">
                                <h3 class="break-words font-semibold text-gray-800">
                                    {{ project.name }}
                                </h3>
                                <p class="break-words text-sm text-gray-600">CUI: {{ project.unifiedCode }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="project.name !== 'Sin asignar'" class="invisible flex space-x-2 group-hover:visible">
                        <button @click.stop="openEditModal(project)" class="text-blue-500 hover:text-blue-700">
                            <Icon name="my-icon:pencil-simple" size="20" class="mr-2 hover:text-red-400" />
                        </button>
                        <button @click.stop="openDeleteModal(project)" class="text-red-500 hover:text-red-700">
                            <Icon name="my-icon:trash" size="20" class="mr-2" />
                        </button>
                    </div>
                </li>
            </ul>
            <p v-if="errorProjects" class="mt-4 px-4 text-sm text-red-500">{{ errorProjects }}</p>
            <div v-if="isLoadingProjects" class="mt-4 text-center">
                <p>Cargando proyectos...</p>
            </div>
        </aside>

        <main class="w-6/8 w-full bg-white p-6">
            <div class="mb-6">
                <div>
                    <h1 class="text-xl font-bold">
                        <span v-if="selectedProject" class="text-gray-800">{{ selectedProject.name }}</span>
                    </h1>
                    <p v-if="selectedProject" class="text-sm text-gray-600">CUI: {{ selectedProject.unifiedCode }}</p>
                </div>
                <div class="mt-4 flex items-center gap-4">
                    <div v-if="areas.length" class="flex items-center gap-4">
                        <button
                            v-for="area in areas"
                            :key="area.id"
                            :class="{
                                'bg-gray-200 font-semibold text-gray-500': selectedArea?.id === area.id,
                                'text-gray-700': selectedArea?.id !== area.id,
                            }"
                            class="rounded-lg px-3 py-2 text-sm hover:bg-gray-200 hover:text-gray-500"
                            @click="selectArea(area)">
                            {{ area.type }}
                        </button>
                    </div>
                    <button v-if="selectedProject" @click="openAddAreaModal" class="flex justify-center rounded-lg px-3 py-2 text-center text-sm hover:bg-gray-200 hover:text-gray-500">
                        <Icon name="my-icon:baseline-plus" size="15" />
                    </button>
                </div>
            </div>

            <div v-if="isLoadingAreas" class="text-center">
                <p>Cargando áreas...</p>
            </div>
            <p v-if="errorAreas" class="mt-4 text-sm text-red-500">{{ errorAreas }}</p>
            <PrintCotizacionC v-if="quotationIds.length > 0" :quotationIds="quotationIds" :selectedProject="selectedProject" :selectedArea="selectedArea" />

            <div v-if="quotations.length" class="mt-6">
                <div v-for="quotation in quotations" :key="quotation.id" class="mb-2 grid grid-cols-8 items-center gap-4 overflow-auto rounded-xl border-2 p-2">
                    <div class="col-span-8 grid grid-cols-8 gap-4">
                        <div class="col-span-2">
                            <div class=" ">Proyecto</div>
                            <div class=" ">
                                <select v-model="selectedProject.id" @change="updateQuotationProject(quotation.id, selectedProject.id)" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                    <option v-for="project in projects" :key="project.id" :value="project.id">
                                        {{ project.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <div class=" ">Área</div>

                            <div class=" ">
                                <select v-model="selectedArea.id" @change="updateQuotationArea(quotation.id, selectedArea.id)" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                    <option v-for="area in areas" :key="area.id" :value="area.id">
                                        {{ area.type }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <div class=" ">Nombre</div>
                            <div class="col-span-2">{{ quotation.name }}</div>
                        </div>

                        <div class="col-span-1">
                            <div class=" ">#</div>
                            <div class="col-span-2">{{ quotation.quotationNumber }}</div>
                        </div>

                        <div class="col-span-1">
                            <div class=" ">Acción</div>
                            <NuxtLink :to="{name: 'cotizaciones-id', params: {id: quotation.id}}" class="" target="_blank">
                                <UiButton defaultText="Detalles"></UiButton>
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="col-span-8 w-full">
                        <Cotizacion :quotationId="quotation.id" :selectedArea="selectedArea" />
                    </div>
                </div>
            </div>
            <p v-else-if="!isLoadingAreas" class="mt-4 w-full text-center text-gray-600">No hay cotizaciones disponibles.</p>
        </main>

        <UiModal v-if="showModalCreate" :showModal="showModalCreate" :closeModal="closeCreateModal" title="Crear Proyecto">
            <template #default>
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-600">Nombre</label>
                    <input id="name" v-model="newProject.name" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div class="mb-4">
                    <label for="unifiedCode" class="block text-sm font-medium text-gray-600"> Código Unificado </label>
                    <input id="unifiedCode" v-model="newProject.unifiedCode" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
            </template>
            <template #actions>
                <button @click="closeCreateModal" class="mr-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancelar</button>
                <button @click="createProject" :disabled="isCreating" class="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                    {{ isCreating ? "Creando..." : "Crear" }}
                </button>
            </template>
        </UiModal>

        <UiModal v-if="showModalEdit" :showModal="showModalEdit" :closeModal="closeEditModal" title="Editar Proyecto">
            <template #default>
                <div class="mb-4">
                    <label for="nameEdit" class="block text-sm font-medium text-gray-600">Nombre</label>
                    <input id="nameEdit" v-model="selectedProject.name" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div class="mb-4">
                    <label for="unifiedCodeEdit" class="block text-sm font-medium text-gray-600"> Código Unificado </label>
                    <input id="unifiedCodeEdit" v-model="selectedProject.unifiedCode" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
            </template>
            <template #actions>
                <button @click="closeEditModal" class="mr-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancelar</button>
                <button @click="updateProject" :disabled="isUpdating" class="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                    {{ isUpdating ? "Actualizando..." : "Guardar" }}
                </button>
            </template>
        </UiModal>

        <UiModal v-if="showModalDelete" :showModal="showModalDelete" :closeModal="closeDeleteModal" title="Eliminar Proyecto">
            <template #default>
                <p>
                    ¿Estás seguro que deseas eliminar el proyecto
                    <strong>{{ selectedProject.name }}</strong
                    >?
                </p>
            </template>
            <template #actions>
                <button @click="closeDeleteModal" class="mr-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancelar</button>
                <button @click="deleteProject" :disabled="isDeleting" class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                    {{ isDeleting ? "Eliminando..." : "Eliminar" }}
                </button>
            </template>
        </UiModal>

        <UiModal v-if="showModalAddArea" :showModal="showModalAddArea" :closeModal="closeAddAreaModal" title="Agregar Área">
            <template #default>
                <div class="mb-4">
                    <label for="areaType" class="block text-sm font-medium text-gray-600">Tipo de Área</label>
                    <input id="areaType" v-model="newArea.type" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Especifica el tipo de área" />
                </div>
            </template>
            <template #actions>
                <button @click="closeAddAreaModal" class="mr-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancelar</button>
                <button @click="addArea" :disabled="isAddingArea" class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                    {{ isAddingArea ? "Agregando..." : "Agregar" }}
                </button>
            </template>
        </UiModal>
    </div>
</template>
