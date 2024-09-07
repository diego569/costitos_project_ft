import {apiurl} from "~/services/api.js";
import {getToken, getUserId} from "@/services/auth";

export const fetchQuotationCount = async () => {
    const userId = getUserId();
    if (userId) {
        try {
            const response = await fetch(apiurl(`/user/cotizaciones/${userId}/quotationcount`), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener cotizaciones");
            }
            const data = await response.json();
            return data.quotationCount;
        } catch (error) {
            console.error("Error al obtener cotizaciones:", error);
            throw error;
        }
    }
};
