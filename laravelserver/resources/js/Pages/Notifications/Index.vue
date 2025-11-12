<script setup>
import { ref, onMounted } from 'vue';
import { Head } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const loading = ref(false);
const notifications = ref([]);
const pagination = ref(null);

const fetchNotifications = async (page = 1) => {
    loading.value = true;
    try {
        const { data } = await api.get('/notification', { params: { page } });
        notifications.value = data.notifications;
        pagination.value = data.pagination;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const goToPage = (page) => {
    if (!pagination.value) return;
    if (page < 1 || page > pagination.value.totalPages) return;
    fetchNotifications(page);
};

const markAsRead = async (notification) => {
    if (notification.is_read) return;
    try {
        await api.patch(`/notification/${notification.id}`);
        notification.is_read = true;
    } catch (error) {
        console.error(error);
    }
};

const deleteNotification = async (notification) => {
    if (!confirm('Delete this notification?')) return;
    try {
        await api.delete(`/notification/${notification.id}`);
        await fetchNotifications(pagination.value?.page ?? 1);
    } catch (error) {
        console.error(error);
    }
};

onMounted(fetchNotifications);
</script>

<template>
    <Head title="Notifications" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Notifications
                    </h2>
                    <p class="text-sm text-gray-500">
                        View system alerts, payout updates, and schedule changes.
                    </p>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <ul class="divide-y divide-gray-100">
                        <li
                            v-if="!loading && notifications.length === 0"
                            class="px-6 py-8 text-center text-sm text-gray-500"
                        >
                            You're all caught up!
                        </li>
                        <li
                            v-for="notification in notifications"
                            :key="notification.id"
                            class="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                            :class="notification.is_read ? 'bg-white' : 'bg-indigo-50/50'"
                        >
                            <div>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize"
                                        :class="{
                                            'bg-indigo-100 text-indigo-700': notification.type === 'schedule_update',
                                            'bg-amber-100 text-amber-700': notification.type === 'offline_alert',
                                            'bg-emerald-100 text-emerald-700': notification.type === 'payout_notice',
                                            'bg-gray-100 text-gray-700': !['schedule_update', 'offline_alert', 'payout_notice'].includes(notification.type),
                                        }"
                                    >
                                        {{ notification.type.replace('_', ' ') }}
                                    </span>
                                    <span class="text-xs text-gray-400">
                                        {{ new Date(notification.created_at).toLocaleString() }}
                                    </span>
                                </div>
                                <p class="mt-2 text-sm text-gray-800">
                                    {{ notification.message }}
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button
                                    @click="markAsRead(notification)"
                                    class="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    :disabled="notification.is_read"
                                >
                                    {{ notification.is_read ? 'Read' : 'Mark as read' }}
                                </button>
                                <button
                                    @click="deleteNotification(notification)"
                                    class="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    </ul>

                    <div
                        v-if="pagination"
                        class="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 text-sm text-gray-600 sm:flex-row"
                    >
                        <div>
                            Page {{ pagination.page }} of
                            {{ pagination.totalPages ?? 1 }}
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                @click="goToPage(pagination.page - 1)"
                                class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50"
                                :disabled="loading || pagination.page === 1"
                            >
                                Previous
                            </button>
                            <button
                                @click="goToPage(pagination.page + 1)"
                                class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50"
                                :disabled="loading || pagination.page === pagination.totalPages"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

