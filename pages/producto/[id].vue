<script setup>
    import {ref, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {apiurl} from "~/services/api.js";

    const product = ref(null);
    const route = useRoute();

    const goBack = () => {
        const router = useRouter();
        router.go(-1);
    };
    const fetchProductById = async (id) => {
        try {
            const response = await fetch(apiurl(`/product/byId/${id}`));
            if (!response.ok) {
                throw new Error("Failed to fetch product details");
            }
            const data = await response.json();
            product.value = data;
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    onMounted(() => {
        const productId = route.params.id;
        if (productId) {
            fetchProductById(productId);
        } else {
            console.error("Product ID not found in route params.");
        }
    });
</script>

<template>
    <!-- <Container>
        <body class="bg-gray-100">
            <header class="bg-white shadow">
                <div class="container mx-auto flex items-center justify-between px-6 py-4">
                    <div class="text-2xl font-bold text-orange-600">Proveedores Puno</div>
                    <nav class="flex space-x-4">
                        <a href="#" class="text-gray-700 hover:text-orange-600">Explorar</a>
                        <a href="#" class="text-gray-700 hover:text-orange-600">Mis productos</a>
                    </nav>
                    <div>
                        <img src=" " alt="User Avatar" class="h-10 w-10 rounded-full" />
                    </div>
                </div>
            </header>
            <main class="container mx-auto px-6 py-8">
                <div class="flex">
                    <div class="w-3/4">
                        <div class="mb-4">
                            <h2 class="text-lg font-medium">Recursos</h2>
                            <input type="text" placeholder="Busca productos" class="mt-2 w-full rounded border p-2" />
                        </div>
                        <div class="mb-4 flex space-x-4">
                            <button class="rounded bg-orange-500 px-4 py-2 text-white">Todos</button>
                            <button class="rounded border px-4 py-2">Seguridad</button>
                            <button class="rounded border px-4 py-2">Tuberías</button>
                            <button class="rounded border px-4 py-2">Instrumentos</button>
                        </div>
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div class="rounded-lg bg-white p-4 shadow">
                                <div class="mb-4 h-40 rounded bg-gray-200"></div>
                                <h3 class="text-lg font-medium">Product title</h3>
                                <p class="text-gray-600">Descripción del producto. Lorem ipsum dolor sit amet.</p>
                                <div class="mt-4 flex items-center">
                                    <span class="mr-2">Precio:</span>
                                    <input type="text" class="mr-2 w-20 rounded border p-2" />
                                    <button class="rounded bg-orange-500 px-4 py-2 text-white">Añadir</button>
                                </div>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow">
                                <div class="mb-4 h-40 rounded bg-gray-200"></div>
                                <h3 class="text-lg font-medium">Product title</h3>
                                <p class="text-gray-600">Descripción del producto. Lorem ipsum dolor sit amet.</p>
                                <div class="mt-4 flex items-center">
                                    <span class="mr-2">Precio:</span>
                                    <input type="text" class="mr-2 w-20 rounded border p-2" />
                                    <button class="rounded bg-orange-500 px-4 py-2 text-white">Añadir</button>
                                </div>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow">
                                <div class="mb-4 h-40 rounded bg-gray-200"></div>
                                <h3 class="text-lg font-medium">Product title</h3>
                                <p class="text-gray-600">Descripción del producto. Lorem ipsum dolor sit amet.</p>
                                <div class="mt-4 flex items-center">
                                    <span class="mr-2">Precio:</span>
                                    <input type="text" class="mr-2 w-20 rounded border p-2" />
                                    <button class="rounded bg-orange-500 px-4 py-2 text-white">Añadir</button>
                                </div>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow">
                                <div class="mb-4 h-40 rounded bg-gray-200"></div>
                                <h3 class="text-lg font-medium">Product title</h3>
                                <p class="text-gray-600">Descripción del producto. Lorem ipsum dolor sit amet.</p>
                                <div class="mt-4 flex items-center">
                                    <span class="mr-2">Precio:</span>
                                    <input type="text" class="mr-2 w-20 rounded border p-2" />
                                    <button class="rounded bg-orange-500 px-4 py-2 text-white">Añadir</button>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 flex items-center justify-between">
                            <span class="text-gray-600">Mostrando 20 de 54 filas</span>
                            <div class="flex items-center space-x-2">
                                <button class="rounded bg-gray-200 px-3 py-1">1</button>
                                <button class="rounded bg-gray-200 px-3 py-1">2</button>
                                <button class="rounded bg-gray-200 px-3 py-1">3</button>
                            </div>
                        </div>
                    </div>
                    <div class="w-1/4 pl-6">
                        <h2 class="text-lg font-medium">Incorporar nuevos productos</h2>
                        <ul class="mt-4 space-y-4">
                            <li class="flex items-center justify-between">
                                <span>Producto name 001</span>
                                <div class="flex items-center">
                                    <span class="mr-2">S/. 50</span>
                                    <button class="text-red-500 hover:text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18h-18zm7 15h-3l-1-12h4v12zm5 0h-3v-12h4l-1 12zm-1.854-15l.354-3h-8l.354 3h7.292z" /></svg>
                                    </button>
                                </div>
                            </li>
                            <li class="flex items-center justify-between">
                                <span>Producto name 002</span>
                                <div class="flex items-center">
                                    <span class="mr-2">S/. 100</span>
                                    <button class="text-red-500 hover:text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18h-18zm7 15h-3l-1-12h4v12zm5 0h-3v-12h4l-1 12zm-1.854-15l.354-3h-8l.354 3h7.292z" /></svg>
                                    </button>
                                </div>
                            </li>
                        </ul>
                        <button class="mt-4 w-full rounded-full bg-orange-500 px-6 py-2 text-white">Confirmar</button>
                    </div>
                </div>
            </main>
        </body>
    </Container> -->

    <Container>
        <div class="bg-gray-100 p-8" v-if="product">
            <div class="container mx-auto rounded-lg bg-white p-8 shadow-lg">
                <div class="flex items-start justify-between">
                    <a href="#" class="text-gray-500 hover:text-gray-700" @click="goBack">&larr; Atrás</a>
                </div>
                <div class="mt-4 flex flex-col md:flex-row">
                    <div class="md:w-1/2">
                        <img :src="product.photo" alt="Producto" class="w-full rounded-lg" />
                    </div>
                    <div class="mt-4 md:mt-0 md:w-1/2 md:pl-8">
                        <h2 class="text-2xl font-semibold">{{ product.name }}</h2>
                        <p class="mt-2 text-gray-600">{{ product.description }}</p>
                        <div class="mt-4">
                            <h3 class="text-lg font-medium">Características del producto:</h3>
                            <ul class="mt-2 list-none">
                                <li class="flex items-center"><span class="mr-2">🔧</span>Marca: SPARK</li>
                                <li class="flex items-center"><span class="mr-2">🔧</span>Marca: SPARK</li>
                                <li class="flex items-center"><span class="mr-2">🎨</span>Color: Negro</li>
                                <li class="flex items-center"><span class="mr-2">🎨</span>Color: Negro</li>
                            </ul>
                        </div>
                        <div class="mt-4 flex items-center">
                            <button class="rounded-full bg-gray-200 px-4 py-2">-</button>
                            <span class="mx-4">1</span>
                            <button class="rounded-full bg-gray-200 px-4 py-2">+</button>
                            <button class="ml-4 rounded-full bg-orange-500 px-6 py-2 text-white">Añadir</button>
                        </div>
                    </div>
                </div>
                <div class="mt-8">
                    <h3 class="text-lg font-medium">Proveedores disponibles</h3>
                    <div class="mt-4 space-y-4">
                        <div class="flex items-center justify-between rounded-lg bg-white p-4 shadow">
                            <div class="flex items-center">
                                <img src=" " alt="Proveedor" class="h-12 w-12 rounded-full" />
                                <div class="ml-4">
                                    <p class="font-semibold">Nuevo Hogar E.I.R.L.</p>
                                    <p class="text-sm text-gray-600">Jr. Tacna 640, Puno - Puno</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <p class="text-lg font-semibold text-gray-800">S/. 25.00 x docena</p>
                                <a href="#" class="ml-4 text-green-500 hover:text-green-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-6 w-6" viewBox="0 0 24 24">
                                        <path d="M12 22c5.514 0 10-4.486 10-10s-4.486-10-10-10-10 4.486-10 10 4.486 10 10 10zm-1.31-6.209l6.072-6.075-1.415-1.413-4.664 4.668-2.344-2.344-1.415 1.414 3.759 3.75z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div class="flex items-center justify-between rounded-lg bg-white p-4 shadow">
                            <div class="flex items-center">
                                <img src=" " alt="Proveedor" class="h-12 w-12 rounded-full" />
                                <div class="ml-4">
                                    <p class="font-semibold">Nuevo Hogar E.I.R.L.</p>
                                    <p class="text-sm text-gray-600">Jr. Tacna 640, Puno - Puno</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <p class="text-lg font-semibold text-gray-800">S/. 30.00 x docena</p>
                                <a href="#" class="ml-4 text-green-500 hover:text-green-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-6 w-6" viewBox="0 0 24 24">
                                        <path d="M12 22c5.514 0 10-4.486 10-10s-4.486-10-10-10-10 4.486-10 10 4.486 10 10 10zm-1.31-6.209l6.072-6.075-1.415-1.413-4.664 4.668-2.344-2.344-1.415 1.414 3.759 3.75z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </Container>
</template>
