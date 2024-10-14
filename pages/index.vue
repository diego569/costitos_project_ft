<script setup>
    import {useRouter} from "vue-router";
    import {getUserRole} from "~/services/auth";

    const router = useRouter();

    onMounted(async () => {
        await redirectBasedOnRole();
    });

    const redirectBasedOnRole = async () => {
        const role = await getUserRole();

        if (role === "user") {
            router.push({name: "catalogo"});
        } else if (role === "supplier") {
            router.push({name: "explorar"});
        } else {
            router.push({name: "catalogo"});
        }
    };
</script>
