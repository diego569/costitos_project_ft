<
<script setup>
    import {ref, onMounted} from "vue";
    const userId = "966bdb00-1a87-4676-a5d8-d6f5fef52ab8";
    const quotations = ref([]);
    const error = ref(null);
    const viewMode = ref("table");

    const fetchQuotationsByUserId = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/cotizaciones/getquotationbyid/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch quotations");
            }
            const data = await response.json();
            quotations.value = data.data;
        } catch (err) {
            console.error("Error fetching quotations:", err);
            error.value = "Error fetching quotations";
        }
    };
    onMounted(fetchQuotationsByUserId);
</script>
<template>
    <div>
        <Container>
            <p class="text-2xl">Cotizaciones</p>
            <div class="mb-4 flex justify-end">
                <button @click="viewMode = 'grid'" :class="{'bg-blue-500 text-white': viewMode === 'grid', 'bg-gray-200 text-gray-700': viewMode !== 'grid'}" class="mr-2 rounded px-4 py-2">Grid View</button>
                <button @click="viewMode = 'table'" :class="{'bg-blue-500 text-white': viewMode === 'table', 'bg-gray-200 text-gray-700': viewMode !== 'table'}" class="rounded px-4 py-2">Table View</button>
            </div>
            <div v-if="error" class="error text-red-500">{{ error }}</div>
            <div v-else-if="quotations.length > 0">
                <div v-if="viewMode === 'grid'" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="quotation in quotations" :key="quotation.id" class="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-md">
                        <h2 class="mb-2 text-xl font-semibold">{{ quotation.name }}</h2>
                        <p class="text-gray-700"><span class="font-medium">Type:</span> {{ quotation.type }}</p>
                        <p class="text-gray-700"><span class="font-medium">Price:</span> {{ quotation.price }}</p>
                        <p class="text-gray-700"><span class="font-medium">Status:</span> {{ quotation.status }}</p>
                        <p class="text-gray-700"><span class="font-medium">Quotation Count:</span> {{ quotation.quotationCount }}</p>
                        <p class="text-gray-700"><span class="font-medium">Quotation Number:</span> {{ quotation.quotationNumber }}</p>
                        <p class="text-gray-700"><span class="font-medium">Created At:</span> {{ new Date(quotation.createdAt).toLocaleString() }}</p>
                        <p class="text-gray-700"><span class="font-medium">Updated At:</span> {{ new Date(quotation.updatedAt).toLocaleString() }}</p>
                        <NuxtLink :to="{name: 'cotizaciones-id', params: {id: quotation.id}}" class="mt-4 inline-block text-blue-500 hover:underline"> View Details </NuxtLink>
                    </div>
                </div>
                <div v-else class="overflow-x-auto rounded-lg">
                    <table class="min-w-full border border-gray-200 bg-white">
                        <thead>
                            <tr class="bg-gray-200 font-semibold text-gray-600">
                                <th class="border-b px-4 py-2 text-start">Numero</th>
                                <th class="border-b px-4 py-2 text-start">Nombre</th>
                                <th class="border-b px-4 py-2 text-start">Tipo</th>
                                <th class="border-b px-4 py-2 text-start">Precio total</th>
                                <th class="border-b px-4 py-2 text-start">Estado</th>
                                <th class="border-b px-4 py-2 text-start">Cantidad de prodcutos</th>
                                <th class="border-b px-4 py-2 text-start">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="quotation in quotations" :key="quotation.id" class="text-gray-700">
                                <td class="border-b px-4 py-2">{{ quotation.quotationNumber }}</td>
                                <td class="border-b px-4 py-2">{{ quotation.name }}</td>
                                <td class="border-b px-4 py-2">{{ quotation.type }}</td>
                                <td class="border-b px-4 py-2">{{ quotation.price }}</td>
                                <td class="border-b px-4 py-2">{{ quotation.status }}</td>
                                <td class="border-b px-4 py-2">{{ quotation.quotationCount }}</td>
                                <td class="border-b px-4 py-2">
                                    <NuxtLink :to="{name: 'cotizaciones-id', params: {id: quotation.id}}" class=""> <PrimaryButton>Ver</PrimaryButton> </NuxtLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                <p class="text-gray-500">No existen cotizaciones .</p>
            </div>
        </Container>
    </div>

    <!-- <section class="bg-white py-8 antialiased md:py-16">
        <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <div class="mx-auto max-w-5xl">
                <div class="gap-4 sm:flex sm:items-center sm:justify-between">
                    <h2 class="text-xl font-semibold text-gray-900 sm:text-2xl">My orders</h2>

                    <div class="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                        <div>
                            <label for="order-type" class="sr-only mb-2 block text-sm font-medium text-gray-900">Select order type</label>
                            <select class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                <option selected>All orders</option>
                                <option value="pre-order">Pre-order</option>
                                <option value="transit">In transit</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <span class="inline-block text-gray-500">from</span>

                        <div>
                            <label for="duration" class="sr-only mb-2 block text-sm font-medium text-gray-900">Select duration</label>
                            <select class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                <option selected>this week</option>
                                <option value="this month">this month</option>
                                <option value="last 3 months">the last 3 months</option>
                                <option value="lats 6 months">the last 6 months</option>
                                <option value="this year">this year</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flow-root sm:mt-8">
                    <div class="divide-y divide-gray-200">
                        <dl class="flex w-full">
                            <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt class="text-base font-medium text-gray-500">Order ID:</dt>
                            </div>
                            <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt class="text-base font-medium text-gray-500">Date:</dt>
                            </div>
                            <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt class="text-base font-medium text-gray-500">Price:</dt>
                            </div>
                            <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt class="text-base font-medium text-gray-500">Status:</dt>
                            </div>
                        </dl>
                        <div v-for="quotation in quotations" :key="quotation.id" class="flex flex-wrap items-center gap-y-4 py-6">
                            <dl class="flex w-full">
                                <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dd class="mt-1.5 text-base font-semibold text-gray-900">
                                        <a href="#" class="hover:underline">{{ quotation.quotationNumber }}</a>
                                    </dd>
                                </div>
                                <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dd class="mt-1.5 text-base font-semibold text-gray-900">{{ quotation.date }}</dd>
                                </div>
                                <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dd class="mt-1.5 text-base font-semibold text-gray-900">{{ quotation.price }}</dd>
                                </div>
                                <div class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                        <svg class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                                        </svg>
                                        {{ quotation.status }}
                                    </dd>
                                </div>

                                <div class="grid w-full gap-4 sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end">
                                    <button type="button" class="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 lg:w-auto">Cancel order</button>
                                    <a href="#" class="inline-flex w-full justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 lg:w-auto">
                                        View details
                                    </a>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
                <nav class="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation example">
                    <ul class="flex h-8 items-center -space-x-px text-sm">
                        <li>
                            <a href="#" class="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <span class="sr-only">Previous</span>
                                <svg class="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700">1</a>
                        </li>
                        <li>
                            <a href="#" class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700">2</a>
                        </li>
                        <li>
                            <a href="#" aria-current="page" class="z-10 flex h-8 items-center justify-center border border-primary-300 bg-primary-50 px-3 leading-tight text-primary-600 hover:bg-primary-100 hover:text-primary-700">3</a>
                        </li>
                        <li>
                            <a href="#" class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700">...</a>
                        </li>
                        <li>
                            <a href="#" class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700">100</a>
                        </li>
                        <li>
                            <a href="#" class="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <span class="sr-only">Next</span>
                                <svg class="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </section> -->
</template>
