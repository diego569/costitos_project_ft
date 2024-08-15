// services/auth.js
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
