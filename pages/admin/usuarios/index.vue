<template>
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
            <h1 class="text-2xl font-semibold">Users</h1>
            <button class="rounded bg-blue-500 px-4 py-2 text-white" @click="showAddUserForm = true">Add User</button>
        </div>
        <table class="min-w-full bg-white">
            <thead>
                <tr>
                    <th class="py-2">First Name</th>
                    <th class="py-2">Last Name</th>
                    <th class="py-2">Email</th>
                    <th class="py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td class="py-2">{{ user.firstName }}</td>
                    <td class="py-2">{{ user.lastName }}</td>
                    <td class="py-2">{{ user.email }}</td>
                    <td class="py-2">
                        <button class="mr-2 rounded bg-yellow-500 px-2 py-1 text-white" @click="editUser(user)">Edit</button>
                        <button class="rounded bg-red-500 px-2 py-1 text-white" @click="deleteUser(user.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="showAddUserForm" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div class="rounded bg-white p-6 shadow-lg">
                <h2 class="mb-4 text-xl">Add User</h2>
                <form @submit.prevent="addUser">
                    <div class="mb-4">
                        <label class="block text-gray-700">First Name</label>
                        <input type="text" v-model="newUser.firstName" class="w-full rounded border px-3 py-2" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Last Name</label>
                        <input type="text" v-model="newUser.lastName" class="w-full rounded border px-3 py-2" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Email</label>
                        <input type="email" v-model="newUser.email" class="w-full rounded border px-3 py-2" />
                    </div>
                    <div class="flex justify-end">
                        <button type="button" class="mr-2 rounded bg-gray-500 px-4 py-2 text-white" @click="showAddUserForm = false">Cancel</button>
                        <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from "vue";
    import {apiurl} from "~/services/api.js";

    const users = ref([]);
    const showAddUserForm = ref(false);
    const newUser = ref({firstName: "", lastName: "", email: ""});

    const fetchUsers = async () => {
        const response = await fetch(apiurl("/admin/user"));
        users.value = await response.json();
    };

    const addUser = async () => {
        await fetch(apiurl("/admin/user"), {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser.value),
        });
        newUser.value = {firstName: "", lastName: "", email: ""};
        showAddUserForm.value = false;
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await fetch(apiurl(`/admin/user/${id}`), {
            method: "DELETE",
        });
        fetchUsers();
    };

    const editUser = async (user) => {
        // Implement edit functionality
    };

    onMounted(fetchUsers);
</script>

<style scoped>
    .table {
        width: 100%;
        border-collapse: collapse;
    }
    .table th,
    .table td {
        border: 1px solid #ddd;
        padding: 8px;
    }
    .table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #f2f2f2;
        color: black;
    }
</style>
