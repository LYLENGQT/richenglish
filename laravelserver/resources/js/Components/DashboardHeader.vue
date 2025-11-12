<script setup>
import { computed, onMounted, ref } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import { BellIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import api from '@/lib/api';

const page = usePage();
const name = computed(() => page.props.auth?.user?.name ?? 'User');
const userId = computed(() => page.props.auth?.user?.id);

const notifications = ref([]);
const loading = ref(false);

const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.is_read).length;
});

const loadNotifications = async () => {
    if (!userId.value) return;
    
    loading.value = true;
    try {
        const { data } = await api.get('/notification');
        notifications.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to load notifications:', error);
    } finally {
        loading.value = false;
    }
};

const markAsRead = async (id) => {
    try {
        await api.patch(`/notification/${id}`, { is_read: true });
        const index = notifications.value.findIndex((n) => n.id === id);
        if (index !== -1) {
            notifications.value[index].is_read = true;
        }
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
};

const initials = computed(() => {
    return name.value
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
});

onMounted(() => {
    loadNotifications();
});
</script>

<template>
    <div class="flex items-center justify-between p-4 bg-white shadow-md rounded-lg w-full mb-3">
        <div class="flex items-center gap-4">
            <div
                class="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-semibold text-lg"
                :title="name"
            >
                {{ initials }}
            </div>
            <h1 class="text-xl font-semibold text-gray-900 truncate">{{ name }}</h1>
        </div>

        <div class="relative">
            <button
                class="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                @click="loadNotifications"
            >
                <BellIcon class="w-6 h-6 text-gray-700" />
                <span
                    v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 rounded-full bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center"
                >
                    {{ unreadCount }}
                </span>
            </button>

            <!-- Notifications dropdown (simplified - can be enhanced with proper dropdown component) -->
            <div
                v-if="notifications.length > 0"
                class="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
                <div class="p-2">
                    <div class="font-semibold px-2 py-1 border-b border-gray-200 mb-2">
                        Notifications
                    </div>
                    <div
                        v-for="notification in notifications"
                        :key="notification.id"
                        :class="{
                            'bg-gray-50': !notification.is_read,
                            'bg-white': notification.is_read,
                        }"
                        class="flex flex-col gap-1 p-2 rounded-md hover:bg-gray-100 cursor-pointer mb-1"
                        @click="markAsRead(notification.id)"
                    >
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-900">
                                {{ notification.type }}
                            </span>
                            <button
                                @click.stop="markAsRead(notification.id)"
                                class="p-1 hover:bg-gray-200 rounded"
                            >
                                <XMarkIcon class="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <span v-if="notification.label" class="text-xs text-gray-600 truncate">
                            {{ notification.label }}
                        </span>
                        <span v-if="notification.message" class="text-xs text-gray-700">
                            {{ notification.message }}
                        </span>
                        <span v-if="notification.created_at" class="text-[10px] text-gray-400">
                            {{ new Date(notification.created_at).toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

