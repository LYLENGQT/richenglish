<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const page = usePage();
const loading = ref(false);
const users = ref([]);
const messages = ref([]);
const activeUser = ref(null);
const messageText = ref('');

const currentUserId = computed(() => page.props.auth?.user?.id);

const loadUsers = async () => {
    const { data } = await api.get('/message/users');
    users.value = data;
};

const loadConversation = async (user) => {
    activeUser.value = user;
    loading.value = true;
    try {
        const { data } = await api.get(`/message/${user.id}`);
        messages.value = data;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const sendMessage = async () => {
    if (!messageText.value.trim() || !activeUser.value) return;
    try {
        const { data } = await api.post('/message', {
            receiver_id: activeUser.value.id,
            message: messageText.value,
        });
        messages.value.push(data);
        messageText.value = '';
    } catch (error) {
        console.error(error);
    }
};

onMounted(async () => {
    await loadUsers();
    if (users.value.length) {
        await loadConversation(users.value[0]);
    }
});
</script>

<template>
    <Head title="Messages" />

    <AuthenticatedLayout>
        <template #header>
            <div>
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Messages
                </h2>
                <p class="text-sm text-gray-500">
                    Communicate securely with admins, teachers, and super administrators.
                </p>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-6 lg:grid-cols-4">
                    <aside class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                            Contacts
                        </div>
                        <ul class="max-h-[32rem] divide-y divide-gray-100 overflow-y-auto">
                            <li
                                v-for="user in users"
                                :key="user.id"
                                :class="[
                                    'cursor-pointer px-4 py-3 text-sm hover:bg-indigo-50',
                                    activeUser?.id === user.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700',
                                ]"
                                @click="loadConversation(user)"
                            >
                                <div class="font-medium">
                                    {{ user.name }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ user.role }}
                                </div>
                            </li>
                        </ul>
                    </aside>

                    <section class="lg:col-span-3">
                        <div class="flex h-[32rem] flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div class="border-b border-gray-100 px-6 py-4">
                                <div v-if="activeUser" class="flex items-center gap-2">
                                    <div>
                                        <div class="text-base font-semibold text-gray-900">
                                            {{ activeUser.name }}
                                        </div>
                                        <div class="text-xs text-gray-500 capitalize">
                                            {{ activeUser.role }}
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-sm text-gray-500">
                                    Select a user to start chatting.
                                </div>
                            </div>

                            <div class="flex-1 overflow-y-auto px-6 py-4">
                                <div
                                    v-if="loading"
                                    class="py-10 text-center text-sm text-gray-500"
                                >
                                    Loading conversation...
                                </div>

                                <div
                                    v-else-if="messages.length === 0"
                                    class="py-10 text-center text-sm text-gray-500"
                                >
                                    No messages yet. Say hello!
                                </div>

                                <div
                                    v-else
                                    class="space-y-4"
                                >
                                    <div
                                        v-for="message in messages"
                                        :key="message.id"
                                        :class="[
                                            'max-w-sm rounded-lg px-4 py-3 text-sm',
                                            message.sender_id === currentUserId
                                                ? 'ml-auto bg-indigo-600 text-white'
                                                : 'mr-auto bg-gray-100 text-gray-800',
                                        ]"
                                    >
                                        <p>
                                            {{ message.message }}
                                        </p>
                                        <div class="mt-2 text-xs opacity-70">
                                            {{ new Date(message.created_at).toLocaleString() }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-gray-100 px-6 py-4">
                                <form
                                    class="flex items-center gap-3"
                                    @submit.prevent="sendMessage"
                                >
                                    <input
                                        v-model="messageText"
                                        type="text"
                                        placeholder="Type your message..."
                                        class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        :disabled="!activeUser"
                                    />
                                    <button
                                        type="submit"
                                        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        :disabled="!activeUser || !messageText.trim()"
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

