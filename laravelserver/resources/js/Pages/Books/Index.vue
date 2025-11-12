<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const page = usePage();
const isSuperAdmin = computed(() => page.props.auth?.user?.role === 'super-admin');

const loading = ref(false);
const books = ref([]);
const pagination = ref(null);

const filters = reactive({
    search: '',
    page: 1,
    limit: 10,
});

const fileInput = ref(null);
const newBook = reactive({
    title: '',
    file: null,
});

const fetchBooks = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/books', { params: filters });
        books.value = data.books;
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
    filters.page = page;
    fetchBooks();
};

const handleFileChange = (event) => {
    const [file] = event.target.files ?? [];
    newBook.file = file ?? null;
};

const resetUploader = () => {
    newBook.title = '';
    newBook.file = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const uploadBook = async () => {
    if (!newBook.title || !newBook.file) return;
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('file', newBook.file);
    try {
        loading.value = true;
        await api.post('/books', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        resetUploader();
        await fetchBooks();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const deleteBook = async (book) => {
    if (!confirm(`Delete ${book.title}?`)) return;
    try {
        loading.value = true;
        await api.delete(`/books/${book.id}`);
        await fetchBooks();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchBooks);
</script>

<template>
    <Head title="Books" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Books
                    </h2>
                    <p class="text-sm text-gray-500">
                        Manage lesson materials, download resources, and upload new content.
                    </p>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="grid gap-6 lg:grid-cols-3">
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div class="mb-4 flex items-center gap-3">
                            <input
                                v-model="filters.search"
                                type="text"
                                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Search title or filename"
                            />
                            <button
                                @click="fetchBooks"
                                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                :disabled="loading"
                            >
                                Search
                            </button>
                        </div>

                        <div class="overflow-hidden rounded-lg border border-gray-200">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <th scope="col" class="px-6 py-3">
                                                Title
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Filename
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Uploaded
                                            </th>
                                            <th scope="col" class="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr v-if="!loading && books.length === 0">
                                            <td
                                                colspan="4"
                                                class="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No books found.
                                            </td>
                                        </tr>
                                        <tr
                                            v-for="book in books"
                                            :key="book.id"
                                            class="text-sm text-gray-700"
                                        >
                                            <td class="px-6 py-4">
                                                <div class="font-medium text-gray-900">
                                                    {{ book.title }}
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                {{ book.original_filename ?? book.filename }}
                                            </td>
                                            <td class="px-6 py-4">
                                                {{
                                                    book.created_at
                                                        ? new Date(book.created_at).toLocaleDateString()
                                                        : '—'
                                                }}
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <div class="flex items-center justify-end gap-2">
                                                    <button
                                                        @click="router.visit(route('books.show', book.id))"
                                                        class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                                    >
                                                        View
                                                    </button>
                                                    <a
                                                        v-if="isSuperAdmin"
                                                        :href="`/storage/${book.path}`"
                                                        target="_blank"
                                                        class="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                                        @click.stop
                                                    >
                                                        Download
                                                    </a>
                                                    <button
                                                        @click.stop="deleteBook(book)"
                                                        class="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                        :disabled="loading"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

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

                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900">
                            Upload New Book
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">
                            Share teaching materials and reference PDFs with staff.
                        </p>
                        <div class="mt-4 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    v-model="newBook.title"
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Enter book title"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    PDF File
                                </label>
                                <input
                                    ref="fileInput"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    @change="handleFileChange"
                                    class="mt-1 block w-full text-sm text-gray-700"
                                />
                                <p class="mt-1 text-xs text-gray-500">
                                    Maximum size 10MB. Supported formats: PDF, DOC(X), PPT(X).
                                </p>
                            </div>
                            <button
                                type="button"
                                @click="uploadBook"
                                class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                :disabled="loading || !newBook.title || !newBook.file"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

