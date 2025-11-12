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
import PdfViewer from '@/Components/PdfViewer.vue';
import {
    ArrowLeftIcon,
    TrashIcon,
    BookOpenIcon,
    UserIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
    bookId: {
        type: [String, Number],
        required: true,
    },
});

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const isSuperAdmin = computed(() => role.value === 'super-admin');
const canDelete = computed(() => ['admin', 'super-admin'].includes(role.value));
const canDownload = computed(() => isSuperAdmin.value);
const allowTextSelection = computed(() => isSuperAdmin.value);

const loading = ref(false);
const book = ref(null);
const deleteDialogOpen = ref(false);
const pdfUrl = computed(() => {
    if (!book.value) return null;
    return `/api/v1/books/${book.value.id}/stream`;
});
const downloadUrl = computed(() => {
    if (!book.value) return null;
    if (book.value.path) {
        return `/storage/${book.value.path}`;
    }
    return pdfUrl.value;
});

const fetchBook = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/books/${props.bookId}`);
        book.value = data;
    } catch (error) {
        console.error('Error fetching book:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    try {
        loading.value = true;
        await api.delete(`/books/${props.bookId}`);
        router.visit(route('books.index'));
    } catch (error) {
        console.error('Error deleting book:', error);
        deleteDialogOpen.value = false;
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

onMounted(() => {
    fetchBook();
});
</script>

<template>
    <Head :title="book ? `${book.title} - Book Details` : 'Book Details'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button
                        @click="router.visit(route('books.index'))"
                        class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">
                            {{ book?.title ?? 'Loading...' }}
                        </h2>
                        <p class="text-sm text-gray-500">
                            Book Viewer
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3" v-if="canDownload || canDelete">
                    <a
                        v-if="canDownload && downloadUrl"
                        :href="downloadUrl"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Download
                    </a>
                    <Button
                        v-if="canDelete"
                        @click="deleteDialogOpen = true"
                        variant="destructive"
                        :disabled="loading"
                    >
                        <TrashIcon class="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !book" class="text-center py-12">
                    <div class="text-gray-500">Loading book information...</div>
                </div>

                <template v-else-if="book">
                    <!-- Book Information Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900">Book Information</h3>
                        </div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Title</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ book.title ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Original Filename</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ book.original_filename ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Uploaded</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(book.created_at) }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- PDF Viewer -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BookOpenIcon class="h-5 w-5" />
                                Book Content
                                <span v-if="!allowTextSelection" class="ml-auto text-xs font-normal text-gray-500">
                                    (Copy, highlight, and download are restricted)
                                </span>
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <PdfViewer
                                v-if="pdfUrl"
                                :src="pdfUrl"
                                :allow-text-selection="allowTextSelection"
                            />
                            <div v-else class="text-center py-12 text-gray-500">
                                PDF not available
                            </div>
                        </div>
                    </div>

                    <!-- Book Assignments Card -->
                    <div v-if="book.book_assignments && book.book_assignments.length > 0" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900">
                                Assignments ({{ book.book_assignments.length }})
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Student
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Teacher
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Assigned Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr
                                            v-for="assignment in book.book_assignments"
                                            :key="assignment.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('assignments.show', assignment.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.student?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.teacher?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(assignment.created_at) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
            <div>
                <DialogHeader>
                    <DialogTitle>Delete Book</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{{ book?.title }}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="handleDelete" :disabled="loading">
                        Delete
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    </AuthenticatedLayout>
</template>

