<script setup>
import { ref, onMounted } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import Dialog from '@/Components/ui/Dialog.vue';
import DialogHeader from '@/Components/ui/DialogHeader.vue';
import DialogTitle from '@/Components/ui/DialogTitle.vue';
import DialogDescription from '@/Components/ui/DialogDescription.vue';
import DialogFooter from '@/Components/ui/DialogFooter.vue';
import { ArrowLeftIcon, TrashIcon, UserIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ userId: { type: [String, Number], required: true } });
const loading = ref(false);
const admin = ref(null);
const deleteDialogOpen = ref(false);

const fetchAdmin = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/teacher/${props.userId}`);
        admin.value = data;
    } catch (error) {
        console.error('Error fetching admin:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    try {
        loading.value = true;
        await api.delete(`/teacher/${props.userId}`);
        router.visit(route('admins.index'));
    } catch (error) {
        console.error('Error deleting admin:', error);
        deleteDialogOpen.value = false;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchAdmin);
</script>

<template>
    <Head :title="admin ? `${admin.name} - Admin Details` : 'Admin Details'" />
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="router.visit(route('admins.index'))" class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">{{ admin?.name ?? 'Loading...' }}</h2>
                        <p class="text-sm text-gray-500">Admin</p>
                    </div>
                </div>
                <Button @click="deleteDialogOpen = true" variant="destructive" :disabled="loading">
                    <TrashIcon class="h-4 w-4 mr-2" />Delete
                </Button>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !admin" class="text-center py-12 text-gray-500">Loading admin information...</div>
                <template v-else-if="admin">
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900">Admin Information</h3>
                        </div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div><dt class="text-sm font-medium text-gray-500">Name</dt><dd class="mt-1 text-sm text-gray-900">{{ admin.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Email</dt><dd class="mt-1 text-sm text-gray-900">{{ admin.email ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Country</dt><dd class="mt-1 text-sm text-gray-900">{{ admin.country ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Status</dt><dd class="mt-1 text-sm text-gray-900">
                                    <span :class="{ 'bg-green-100 text-green-800': admin.status === 'active', 'bg-red-100 text-red-800': admin.status === 'inactive' }" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{ admin.status ?? '—' }}</span>
                                </dd></div>
                            </dl>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <Dialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
            <DialogHeader>
                <DialogTitle>Delete Admin</DialogTitle>
                <DialogDescription>Are you sure you want to delete <strong>{{ admin?.name }}</strong>? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                <Button variant="destructive" @click="handleDelete" :disabled="loading">Delete</Button>
            </DialogFooter>
        </Dialog>
    </AuthenticatedLayout>
</template>

