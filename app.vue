<script setup>
    import {ref, onMounted, computed} from "vue";
    import {useRoute, useRouter} from "vue-router";
    import {cart, removeFromCart, incrementQuantity, showAlert, decrementQuantity, uniqueProductsCount, showModal, modalProduct, alertMessage, updateCartProduct} from "~/services/cart";
    import {sendQuotationRequest} from "~/services/quotation";
    import {showMenu} from "@/services/menuService";
    import {getUserId, getToken} from "@/services/auth";
    import {apiurl} from "~/services/api.js";
    import {totalProductosSeleccionados} from "~/services/usercart.js";
    import {totalProductosSeleccionadosSupplier} from "~/services/suppliercart.js";

    const route = useRoute();
    const authRoutes = ["ingresar", "registrarse"];
    const isAuthRoute = computed(() => authRoutes.includes(route.name));

    const totalProductos = computed(() => totalProductosSeleccionados());
    const totalProductossupplier = computed(() => totalProductosSeleccionadosSupplier());

    watch(totalProductos, (newTotal) => {
        if (newTotal > 0) {
            showMenu.value = true;
        }
    });

    watch(totalProductossupplier, (newTotal) => {
        if (newTotal > 0) {
            showMenu.value = true;
        }
    });
    const showQuoteModal = ref(false);
    const numberOfSuppliers = ref(3);

    const toggleMenu = () => {
        showMenu.value = !showMenu.value;
    };

    const toggleQuoteModal = () => {
        showQuoteModal.value = !showQuoteModal.value;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    const closeAllModals = () => {
        showModal.value = false;
        showQuoteModal.value = false;
    };

    const showAlertMessage = (message) => {
        alertMessage.value = message;
        showAlert.value = true;
        setTimeout(() => {
            showAlert.value = false;
        }, 3000);
    };

    const userId = ref(getUserId());
    const userRole = ref(null);
    const layout = ref("default");

    const loadUserData = () => {
        if (userId.value) {
            const userData = JSON.parse(localStorage.getItem("userData")) || {};
            userRole.value = userData.role || null;

            if (userRole.value === "supplier") {
                layout.value = "supplier";
            } else if (userRole.value === "superadmin") {
                layout.value = "admin";
            } else {
                layout.value = "default";
            }
        } else {
            console.error("User ID not found");
        }
    };

    onMounted(() => {
        loadUserData();
        console.log("user: ", userId.value);
    });

    const router = useRouter();
    const handleSendQuotationRequest = async () => {
        const quotation = {
            userId: userId.value,
            name: "Cotización",
            type: "regular",
            price: "20",
            status: "pending",
            quotationCount: numberOfSuppliers.value,
        };
        const result = await sendQuotationRequest(quotation, cart.value);

        if (result.success) {
            closeAllModals();
            showMenu.value = false;
            const id = result.data;
            router.push(`/cotizaciones/${id}`);
        } else {
            showAlertMessage(result.message);
        }
    };

    const sendCartToBackend = async () => {
        try {
            const products = cart.value.map((item) => ({
                productId: item.id,
                price: item.price,
                unitOfMeasure: item.unitOfMeasure,
            }));

            console.table(products);

            const response = await fetch(apiurl(`//theproducts/${userId.value}/`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({products}),
            });

            if (response.ok) {
                showAlertMessage("Carrito enviado exitosamente");
            } else {
                const errorData = await response.json();
                showAlertMessage(`Error al enviar el carrito: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error sending cart to backend:", error);
            showAlertMessage("Error al enviar el carrito");
        }
    };
</script>
<template>
    <div class="min-h-screen bg-gray-100" v-if="!isAuthRoute">
        <NuxtLayout :name="layout" :showMenu="showMenu" @toggle-menu="toggleMenu">
            <div :class="['container mx-auto grid gap-4 px-2 py-2 transition-all duration-500', showMenu ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7' : ' ']">
                <div :class="['grid overflow-auto rounded-lg', showMenu ? 'col-span-full xl:col-span-4 2xl:col-span-5' : '']">
                    <NuxtPage class="grid min-w-[360px]" />
                </div>
                <div v-if="showMenu" :class="['sticky top-20 hidden max-h-[calc(100vh_-_100px)] items-start justify-center rounded-lg bg-white shadow-sm lg:flex lg:flex-col', showMenu ? 'col-span-2' : '']">
                    <UserCart v-if="userRole !== 'supplier'" />
                    <SupplierCart v-else />
                </div>
            </div>
        </NuxtLayout>

        <Modal :model="showQuoteModal">
            <template #title>Cotizar</template>
            <label for="numberOfSuppliers">Número de Proveedores:</label>
            <select v-model="numberOfSuppliers" id="numberOfSuppliers" class="mx-1.5 rounded-md border border-gray-300 px-2 py-1">
                <option v-for="number in 10" :key="number" :value="number">{{ number }}</option>
            </select>
            <template #button>
                <PrimaryButton @click="handleSendQuotationRequest">Cotizar</PrimaryButton>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="toggleQuoteModal" ref="cancelButtonRef">Cancelar</button>
            </template>
        </Modal>

        <Modal :model="showModal">
            <template #title>
                <div class="flex flex-col items-center gap-3 md:flex-row">
                    <img :src="modalProduct?.photo" alt="" class="flex h-24 w-auto rounded-lg text-center md:h-32" />
                    {{ modalProduct?.name }}
                </div>
            </template>

            <div class="py-3">
                <label for="Quantity" class="sr-only"> Quantity </label>
                <button type="button" class="size-10 leading-10 text-gray-600 transition hover:opacity-75" @click="modalProduct.quantity = Math.max(1, modalProduct.quantity - 1)">&minus;</button>

                <input
                    type="number"
                    id="Quantity"
                    v-model.number="modalProduct.quantity"
                    min="1"
                    class="h-10 w-12 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none" />
                <button type="button" class="size-10 leading-10 text-gray-600 transition hover:opacity-75" @click="modalProduct.quantity++">&plus;</button>
            </div>
            <template #button>
                <PrimaryButton @click="updateCartProduct">Actualizar</PrimaryButton>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeModal" ref="cancelButtonRef">Cancelar</button>
            </template>
        </Modal>

        <div v-if="showAlert" class="fixed bottom-0 left-0 mb-4 ml-4">
            <div class="flex items-center rounded-lg border border-primary-300 bg-primary-50 p-4 text-sm text-primary-800" role="alert">
                <span class="font-medium">{{ alertMessage }}</span>
            </div>
        </div>
    </div>

    <NuxtPage v-else />
</template>
