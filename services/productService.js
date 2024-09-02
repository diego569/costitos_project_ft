import {v4 as uuidv4} from "uuid";
import {fetchWithAuth, getUserId} from "@/services/auth";
import {apiurl} from "~/services/api.js";

export const uploadImage = async (file) => {
    if (!file) {
        throw new Error("Por favor seleccione un archivo.");
    }

    const formData = new FormData();
    formData.append("myfile", file);

    const response = await fetch(apiurl("/supplier/crear/uploadimage"), {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Error al subir la imagen.");
    }

    const data = await response.json();
    return data.id;
};

export const createProduct = async (product, selectedSubcategoryId, imageId) => {
    const supplierId = getUserId();
    const productData = {
        id: uuidv4(),
        name: product.name,
        description: product.description,
        imageId: imageId,
        subcategoryId: selectedSubcategoryId || product.subcategoryId,
        supplierId: supplierId,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const response = await fetch(apiurl("/supplier/crear/createproduct"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });

    if (!response.ok) {
        throw new Error("Error al crear el producto.");
    }

    const data = await response.json();
    return data.id;
};

export const createSupplierProduct = async (supplierProduct, productId, productName) => {
    const supplierId = getUserId();
    const supplierProductData = {
        id: uuidv4(),
        supplierId: supplierId,
        productId: productId,
        productName: productName,
        price: supplierProduct.price,
        unitOfMeasure: supplierProduct.unitOfMeasure,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const response = await fetch(apiurl("/supplier/crear/createsupplierproduct"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierProductData),
    });

    if (!response.ok) {
        throw new Error("Error al crear el producto.");
    }

    return true;
};
