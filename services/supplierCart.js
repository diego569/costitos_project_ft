import {ref, computed, watch} from "vue";

const cartSp = ref([]);
const showModalSp = ref(false);
const modalProductSp = ref(null);
const alertMessageSp = ref("");
const showAlertSp = ref(false);

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
    cartSp.value = JSON.parse(localStorage.getItem("supplierCart")) || [];
}

watch(
    cartSp,
    (newCart) => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem("supplierCart", JSON.stringify(newCart));
        }
    },
    {deep: true}
);

const showAlertMessage = (message) => {
    alertMessageSp.value = message;
    showAlertSp.value = true;
    setTimeout(() => {
        showAlertSp.value = false;
    }, 3000);
};

const addToCartSp = (product) => {
    const existingProduct = cartSp.value.find((item) => item.id === product.id);
    if (existingProduct) {
        modalProductSp.value = {...existingProduct};
        showModalSp.value = true;
    } else {
        cartSp.value.push({...product});
        showAlertMessage("Producto agregado al carrito");
    }
};

const updateCartProductSp = () => {
    const index = cartSp.value.findIndex((item) => item.id === modalProductSp.value.id);
    if (index !== -1) {
        cartSp.value[index] = {...modalProductSp.value};
        showAlertMessage("Producto actualizado en el carrito");
    }
    showModalSp.value = false;
};

const removeFromCartSp = (productId) => {
    cartSp.value = cartSp.value.filter((item) => item.id !== productId);
    showAlertMessage("Producto eliminado del carrito");
};

const incrementQuantitySp = (item) => {
    item.quantity++;
};

const decrementQuantitySp = (item) => {
    if (item.quantity > 1) {
        item.quantity--;
    }
};

const uniqueProductsCountSp = computed(() => {
    const uniqueProductIds = new Set();
    cartSp.value.forEach((item) => {
        uniqueProductIds.add(item.id);
    });
    return uniqueProductIds.size;
});

export {cartSp, showModalSp, modalProductSp, alertMessageSp, showAlertSp, addToCartSp, updateCartProductSp, removeFromCartSp, incrementQuantitySp, decrementQuantitySp, uniqueProductsCountSp};
