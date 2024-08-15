import {ref, computed, watch} from "vue";

const cart = ref([]);
const showModal = ref(false);
const modalProduct = ref(null);
const alertMessage = ref("");
const showAlert = ref(false);

const isLocalStorageAvailable = () => {
    try {
        const test = "__localStorageTest__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

if (isLocalStorageAvailable()) {
    cart.value = JSON.parse(localStorage.getItem("cart")) || [];
}

watch(
    cart,
    (newCart) => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem("cart", JSON.stringify(newCart));
        }
    },
    {deep: true}
);

const showAlertMessage = (message) => {
    alertMessage.value = message;
    showAlert.value = true;
    setTimeout(() => {
        showAlert.value = false;
    }, 3000);
};

const addToCart = (product) => {
    const existingProduct = cart.value.find((item) => item.id === product.id);
    if (existingProduct) {
        modalProduct.value = {...existingProduct};
        showModal.value = true;
    } else {
        cart.value.push({...product});
        showAlertMessage("Producto agregado al carrito");
    }
};

const updateCartProduct = () => {
    const index = cart.value.findIndex((item) => item.id === modalProduct.value.id);
    if (index !== -1) {
        cart.value[index] = {...modalProduct.value};
        showAlertMessage("Producto actualizado en el carrito");
    }
    showModal.value = false;
};

const removeFromCart = (productId) => {
    cart.value = cart.value.filter((item) => item.id !== productId);
    showAlertMessage("Producto eliminado del carrito");
};

const incrementQuantity = (item) => {
    item.quantity++;
};

const decrementQuantity = (item) => {
    if (item.quantity > 1) {
        item.quantity--;
    }
};

const uniqueProductsCount = computed(() => {
    const uniqueProductIds = new Set();
    cart.value.forEach((item) => {
        uniqueProductIds.add(item.id);
    });
    return uniqueProductIds.size;
});

export {cart, showModal, modalProduct, alertMessage, showAlert, addToCart, updateCartProduct, removeFromCart, incrementQuantity, decrementQuantity, uniqueProductsCount};
