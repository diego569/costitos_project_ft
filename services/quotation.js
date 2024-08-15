// service.js
export const sendQuotationRequest = async (quotation, cart) => {
    console.log(quotation);
    try {
        const response = await fetch("http://localhost:8000/api/quotation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(quotation),
        });

        if (!response.ok) {
            throw new Error("Error al enviar la cotización");
        }

        const data = await response.json();
        const result = await addProductsToQuotation(data.quotationId, cart);
        return result;
    } catch (error) {
        console.error("Error al enviar la cotización:", error);
        return {
            success: false,
            message: "Error al enviar la cotización",
        };
    }
};

const addProductsToQuotation = async (quotationId, cart) => {
    try {
        const products = cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        console.table("Datos que se envían a la API:", products);

        const response = await fetch(`http://localhost:8000/api/quotation/${quotationId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(products),
        });

        if (!response.ok) {
            throw new Error("Error al agregar productos a la cotización");
        }

        const data = await response.json();
        const result = await getPricesFromSuppliers(quotationId, data.qpId);
        return result;
    } catch (error) {
        console.error("Error al agregar productos a la cotización:", error);
        return {
            success: false,
            message: "Error al agregar productos a la cotización",
        };
    }
};

const getPricesFromSuppliers = async (quotationId, qpIds) => {
    try {
        const pricesResponse = await fetch(`http://localhost:8000/api/quotation/products/prices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({qpIds}),
        });

        if (!pricesResponse.ok) {
            throw new Error("Error al obtener precios de los proveedores");
        }

        const pricesData = await pricesResponse.json();
        const result = await createSupplierProducts(quotationId, pricesData);
        return result;
    } catch (error) {
        console.error("Error al obtener precios de los proveedores:", error);
        return {
            success: false,
            message: "Error al obtener precios de los proveedores",
        };
    }
};

const createSupplierProducts = async (quotationId, pricesData) => {
    try {
        const supplierProductsResponse = await fetch("http://localhost:8000/api/quotation3/supplier-products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pricesData),
        });

        if (!supplierProductsResponse.ok) {
            throw new Error("Error al crear productos");
        }

        const responseData = await supplierProductsResponse.json();
        return {
            success: true,
            message: "Productos y precios de los proveedores agregados a la cotización con éxito",
            data: quotationId,
        };
    } catch (error) {
        console.error("Error al crear productos:", error);
        return {
            success: false,
            message: "Error al crear productos",
        };
    }
};
