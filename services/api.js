export const apiurl = (path) => {
    const config = useRuntimeConfig();
    return `${config.public.BASE_URL}${path}`;
};
export const url = () => {
    const config = useRuntimeConfig();
    return config.public.F_BASE_URL;
};
