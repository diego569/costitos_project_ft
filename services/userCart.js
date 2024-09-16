import {reactive, watchEffect} from "vue";

const isBrowser = typeof window !== "undefined";

const carrito = reactive(isBrowser ? JSON.parse(localStorage.getItem("carrito") || "[]") : []);

if (isBrowser) {
    watchEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    });
}

export const agregarProducto = (producto, medidaSeleccionada) => {
    const productoExistente = carrito.find((item) => item.producto.id === producto.id && item.producto.unitOfMeasure === medidaSeleccionada.unitOfMeasure);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            producto: {
                ...producto,
                unitOfMeasure: medidaSeleccionada.unitOfMeasure,
            },
            cantidad: 1,
        });
    }
};

export const quitarProducto = (productoId, unitOfMeasure) => {
    const index = carrito.findIndex((item) => item.producto.id === productoId && item.producto.unitOfMeasure === unitOfMeasure);
    if (index !== -1) {
        carrito.splice(index, 1);
    }
};

export const incrementarCantidad = (productoId, unitOfMeasure) => {
    const producto = carrito.find((item) => item.producto.id === productoId && item.producto.unitOfMeasure === unitOfMeasure);
    if (producto) {
        producto.cantidad += 1;
    }
};

export const decrementarCantidad = (productoId, unitOfMeasure) => {
    const producto = carrito.find((item) => item.producto.id === productoId && item.producto.unitOfMeasure === unitOfMeasure);
    if (producto && producto.cantidad > 1) {
        producto.cantidad -= 1;
    }
};

export const updateCantidad = (productoId, unitOfMeasure, cantidad) => {
    const producto = carrito.find((item) => item.producto.id === productoId && item.producto.unitOfMeasure === unitOfMeasure);
    if (producto && cantidad >= 1) {
        producto.cantidad = cantidad;
    } else if (producto && cantidad < 1) {
        producto.cantidad = 1;
    }
};

export const obtenerCarrito = () => {
    return carrito;
};

export const totalProductosSeleccionados = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
};

export const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    carrito.length = 0;
};
