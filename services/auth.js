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

export const logout = async (router) => {
    try {
        const response = await fetch("http://localhost:8000/api/auth/salir/logout", {
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
