import {reactive, watchEffect} from "vue";

const isBrowser = typeof window !== "undefined";

// Leer carrito de localStorage al iniciar
const carrito = reactive(isBrowser ? JSON.parse(localStorage.getItem("carrito") || "[]") : []);

// Guardar carrito en localStorage cada vez que cambie
if (isBrowser) {
    watchEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    });
}

export const agregarProducto = (producto, medidaSeleccionada) => {
    const productoExistente = carrito.find((item) => item.producto.productId === producto.productId && item.medida.supplierProductId === medidaSeleccionada.supplierProductId);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            producto,
            medida: medidaSeleccionada,
            cantidad: 1,
        });
    }
};

export const quitarProducto = (productoId, medidaId) => {
    const index = carrito.findIndex((item) => item.producto.productId === productoId && item.medida.supplierProductId === medidaId);
    if (index !== -1) {
        carrito.splice(index, 1);
    }
};

export const incrementarCantidad = (productoId, medidaId) => {
    const producto = carrito.find((item) => item.producto.productId === productoId && item.medida.supplierProductId === medidaId);
    if (producto) {
        producto.cantidad += 1;
    }
};

export const decrementarCantidad = (productoId, medidaId) => {
    const producto = carrito.find((item) => item.producto.productId === productoId && item.medida.supplierProductId === medidaId);
    if (producto && producto.cantidad > 1) {
        producto.cantidad -= 1;
    }
    // Si la cantidad es 1 o menor, no hace nada
};

export const cambiarMedida = (productoId, medidaId, nuevaMedida) => {
    const producto = carrito.find((item) => item.producto.productId === productoId && item.medida.supplierProductId === medidaId);
    if (producto) {
        producto.medida = JSON.parse(nuevaMedida);
    }
};

export const obtenerCarrito = () => {
    return carrito;
};

export const totalProductosSeleccionados = () => {
    return carrito.filter((item) => item.medida).length;
};
