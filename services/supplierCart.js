import {reactive, watchEffect} from "vue";

const isBrowser = typeof window !== "undefined";

const carritoSupplier = reactive(isBrowser ? JSON.parse(localStorage.getItem("carritoSupplier") || "[]") : []);

if (isBrowser) {
    watchEffect(() => {
        localStorage.setItem("carritoSupplier", JSON.stringify(carritoSupplier));
    });
}

export const agregarProductoSupplier = (producto) => {
    const productoExistente = carritoSupplier.find((item) => item.producto.id === producto.id);

    if (!productoExistente) {
        carritoSupplier.push({
            producto: {
                id: producto.id,
                name: producto.name,
                photo: producto.photo,
            },
            medidas: [
                {
                    unitOfMeasure: "",
                    price: "",
                },
            ],
        });
    }
};

export const quitarProductoSupplier = (productoId) => {
    const index = carritoSupplier.findIndex((item) => item.producto.id === productoId);
    if (index !== -1) {
        carritoSupplier.splice(index, 1);
    }
};

export const updateProductoSupplier = (productoId, medidaIndex, key, value) => {
    const producto = carritoSupplier.find((item) => item.producto.id === productoId);
    if (producto) {
        producto.medidas[medidaIndex][key] = value;
    }
};

export const agregarMedidaSupplier = (productoId) => {
    const producto = carritoSupplier.find((item) => item.producto.id === productoId);
    if (producto) {
        producto.medidas.push({
            unitOfMeasure: "",
            price: "",
        });
    }
};

export const quitarMedidaSupplier = (productoId, medidaIndex) => {
    const producto = carritoSupplier.find((item) => item.producto.id === productoId);
    if (producto && producto.medidas.length > 1) {
        producto.medidas.splice(medidaIndex, 1);
    }
};

export const obtenerCarritoSupplier = () => {
    return carritoSupplier;
};

export const totalProductosSeleccionadosSupplier = () => {
    return carritoSupplier.length;
};

export const vaciarCarritoSupplier = () => {
    localStorage.removeItem("carritoSupplier");
    carritoSupplier.length = 0;
};
