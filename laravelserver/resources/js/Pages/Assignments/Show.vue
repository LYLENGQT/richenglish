<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import Dialog from '@/Components/ui/Dialog.vue';
import DialogHeader from '@/Components/ui/DialogHeader.vue';
import DialogTitle from '@/Components/ui/DialogTitle.vue';
import DialogDescription from '@/Components/ui/DialogDescription.vue';
import DialogFooter from '@/Components/ui/DialogFooter.vue';
import { ArrowLeftIcon, TrashIcon, BookOpenIcon, UserIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ assignmentId: { type: [String, Number], required: true } });
const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const canDelete = computed(() => ['admin', 'super-admin'].includes(role.value));

const loading = ref(false);
const assignment = ref(null);
const deleteDialogOpen = ref(false);

const fetchAssignment = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/book-assign/${props.assignmentId}`);
        assignment.value = data;
    } catch (error) {
        console.error('Error fetching assignment:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    try {
        loading.value = true;
        await api.delete(`/book-assign/${props.assignmentId}`);
        router.visit(route('assignments.index'));
    } catch (error) {
        console.error('Error deleting assignment:', error);
        deleteDialogOpen.value = false;
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

onMounted(fetchAssignment);
</script>

<template>
    <Head :title="assignment ? `Book Assignment Details` : 'Book Assignment Details'" />
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="router.visit(route('assignments.index'))" class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">Book Assignment</h2>
                        <p class="text-sm text-gray-500">{{ assignment?.book?.title ?? 'Loading...' }}</p>
                    </div>
                </div>
                <Button v-if="canDelete" @click="deleteDialogOpen = true" variant="destructive" :disabled="loading">
                    <TrashIcon class="h-4 w-4 mr-2" />Delete
                </Button>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !assignment" class="text-center py-12 text-gray-500">Loading assignment information...</div>
                <template v-else-if="assignment">
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900">Assignment Information</h3></div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div><dt class="text-sm font-medium text-gray-500">Book</dt><dd class="mt-1 text-sm text-gray-900">{{ assignment.book?.title ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Student</dt><dd class="mt-1 text-sm text-gray-900">{{ assignment.student?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Teacher</dt><dd class="mt-1 text-sm text-gray-900">{{ assignment.teacher?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Assigned By</dt><dd class="mt-1 text-sm text-gray-900">{{ assignment.assigned_by?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Assigned Date</dt><dd class="mt-1 text-sm text-gray-900">{{ formatDate(assignment.created_at) }}</dd></div>
                            </dl>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <Dialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
            <div>
                <DialogHeader>
                    <DialogTitle>Delete Assignment</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this assignment? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="handleDelete" :disabled="loading">Delete</Button>
                </DialogFooter>
            </div>
        </Dialog>
    </AuthenticatedLayout>
</template>

