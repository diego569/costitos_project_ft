import {apiurl} from "~/services/api.js";

export const isLocalStorageAvailable = () => {
    try {
        const test = "__localStorageTest__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

export const getToken = () => {
    if (isLocalStorageAvailable()) {
        return localStorage.getItem("token");
    }
    return null;
};

export const getUserId = () => {
    if (isLocalStorageAvailable()) {
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        return userData.id || null;
    }
    return null;
};

export const getUserName = () => {
    if (isLocalStorageAvailable()) {
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        return userData.name || null;
    }
    return null;
};

export const getUserRole = () => {
    if (isLocalStorageAvailable()) {
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        return userData.role || null;
    }
    return null;
};

export const logout = async (router) => {
    try {
        const response = await fetch(apiurl("/auth/salir/logout"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al cerrar sesión");
        }

        localStorage.clear();

        router.push({name: "ingresar"}).then(() => {
            window.location.reload();
        });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};
export const getCart = () => {
    if (isLocalStorageAvailable()) {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
};

export const fetchWithAuth = async (url, method, body) => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error en ${url}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

const redirectBasedOnRole = (role) => {
    if (role === "user") {
        window.location.href = "/catalogo";
    } else if (role === "supplier") {
        window.location.href = "/explorar";
    } else {
        window.location.href = "/catalogo";
    }
};

const storeUserData = (data) => {
    localStorage.setItem("userData", JSON.stringify(data.data));
    localStorage.setItem("token", data.token);
};

const processAuthResponse = (response, error) => {
    if (!response.ok) {
        throw new Error("Error en la autenticación");
    }

    return response.json().then((data) => {
        storeUserData(data);

        error.value = "";

        const role = data.data.role;
        redirectBasedOnRole(role);
    });
};

export async function login(credentials, error) {
    try {
        const response = await fetch(apiurl("/auth/ingresar/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        await processAuthResponse(response, error);
    } catch (err) {
        error.value = err.message;
    }
}

export const register = async (registerData, error) => {
    if (!registerData.terms) {
        error.value = "Debe aceptar los términos y condiciones para continuar";
        return;
    }

    if (registerData.password !== registerData.confirmPassword) {
        error.value = "Las contraseñas no coinciden";
        return;
    }

    try {
        const response = await fetch(apiurl("/auth/registrarse/register"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });

        await processAuthResponse(response, error);
    } catch (err) {
        error.value = err.message;
    }
};
