export const apiurl = (path) => {
    const config = useRuntimeConfig();
    return `${config.public.BASE_URL}${path}`;
};
