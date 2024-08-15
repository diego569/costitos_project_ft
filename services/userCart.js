import {ref, computed, watch} from "vue";

const cartUr = ref([]);
const showModalUr = ref(false);
const modalProductUr = ref(null);
const alertMessageUr = ref("");
const showAlertUr = ref(false);

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
    cartUr.value = JSON.parse(localStorage.getItem("userCart")) || [];
}

watch(
    cartUr,
    (newCart) => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem("userCart", JSON.stringify(newCart));
        }
    },
    {deep: true}
);

const showAlertMessage = (message) => {
    alertMessageUr.value = message;
    showAlertUr.value = true;
    setTimeout(() => {
        showAlertUr.value = false;
    }, 3000);
};

const addToCartUr = (product) => {
    const existingProduct = cartUr.value.find((item) => item.id === product.id);
    if (existingProduct) {
        modalProductUr.value = {...existingProduct};
        showModalUr.value = true;
    } else {
        cartUr.value.push({...product});
        showAlertMessage("Producto agregado al carrito");
    }
};

const updateCartProductUr = () => {
    const index = cartUr.value.findIndex((item) => item.id === modalProductUr.value.id);
    if (index !== -1) {
        cartUr.value[index] = {...modalProductUr.value};
        showAlertMessage("Producto actualizado en el carrito");
    }
    showModalUr.value = false;
};

const removeFromCartUr = (productId) => {
    cartUr.value = cartUr.value.filter((item) => item.id !== productId);
    showAlertMessage("Producto eliminado del carrito");
};

const incrementQuantityUr = (item) => {
    item.quantity++;
};

const decrementQuantityUr = (item) => {
    if (item.quantity > 1) {
        item.quantity--;
    }
};

const uniqueProductsCountUr = computed(() => {
    const uniqueProductIds = new Set();
    cartUr.value.forEach((item) => {
        uniqueProductIds.add(item.id);
    });
    return uniqueProductIds.size;
});

export {cartUr, showModalUr, modalProductUr, alertMessageUr, showAlertUr, addToCartUr, updateCartProductUr, removeFromCartUr, incrementQuantityUr, decrementQuantityUr, uniqueProductsCountUr};
