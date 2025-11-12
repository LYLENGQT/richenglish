<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);
const teachers = ref([]);
const students = ref([]);
const books = ref([]);

const filters = reactive({
    page: 1,
    limit: 10,
});

const form = reactive({
    student_id: '',
    teacher_id: '',
    book_id: '',
});

const fetchAssignments = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/book-assign', { params: filters });
        rows.value = data.assignments;
        pagination.value = data.pagination;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const fetchOptions = async () => {
    const [teachersRes, studentsRes, booksRes] = await Promise.all([
        api.get('/dashboard/teachers'),
        api.get('/dashboard/students'),
        api.get('/books', { params: { limit: 100 } }),
    ]);
    teachers.value = teachersRes.data;
    students.value = studentsRes.data;
    books.value = booksRes.data.books ?? [];
};

const submitAssignment = async () => {
    if (!form.student_id || !form.teacher_id || !form.book_id) return;
    try {
        loading.value = true;
        await api.post('/book-assign', form);
        form.student_id = '';
        form.teacher_id = '';
        form.book_id = '';
        await fetchAssignments();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const deleteAssignment = async (assignment) => {
    if (!confirm('Remove this assignment?')) return;
    try {
        loading.value = true;
        await api.delete(`/book-assign/${assignment.id}`);
        await fetchAssignments();
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
    fetchAssignments();
};

onMounted(async () => {
    await fetchOptions();
    await fetchAssignments();
});
</script>

<template>
    <Head title="Book Assignments" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Book Assignments
                    </h2>
                    <p class="text-sm text-gray-500">
                        Track which materials each student should use and assign new resources.
                    </p>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="grid gap-6 lg:grid-cols-3">
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div class="overflow-hidden rounded-lg border border-gray-200">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <th scope="col" class="px-6 py-3">
                                                Student
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Teacher
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Book
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Assigned By
                                            </th>
                                            <th scope="col" class="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr v-if="!loading && rows.length === 0">
                                            <td
                                                colspan="5"
                                                class="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No book assignments yet.
                                            </td>
                                        </tr>
                                        <tr
                                            v-for="assignment in rows"
                                            :key="assignment.id"
                                            class="text-sm text-gray-700"
                                        >
                                            <td class="px-6 py-4">
                                                {{ assignment.student?.name ?? '—' }}
                                            </td>
                                            <td class="px-6 py-4">
                                                {{ assignment.teacher?.name ?? '—' }}
                                            </td>
                                            <td class="px-6 py-4">
                                                {{ assignment.book?.title ?? '—' }}
                                            </td>
                                            <td class="px-6 py-4">
                                                {{ assignment.assigned_by?.name ?? '—' }}
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <div class="flex items-center justify-end gap-2">
                                                    <button
                                                        @click="router.visit(route('assignments.show', assignment.id))"
                                                        class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        @click.stop="deleteAssignment(assignment)"
                                                        class="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                        :disabled="loading"
                                                    >
                                                        Remove
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
                            Assign Book
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">
                            Pair a student with the appropriate learning material and teacher.
                        </p>

                        <div class="mt-4 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Student
                                </label>
                                <select
                                    v-model="form.student_id"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select student</option>
                                    <option
                                        v-for="student in students"
                                        :key="student.id"
                                        :value="student.id"
                                    >
                                        {{ student.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Teacher
                                </label>
                                <select
                                    v-model="form.teacher_id"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select teacher</option>
                                    <option
                                        v-for="teacher in teachers"
                                        :key="teacher.id"
                                        :value="teacher.id"
                                    >
                                        {{ teacher.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Book
                                </label>
                                <select
                                    v-model="form.book_id"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select book</option>
                                    <option
                                        v-for="book in books"
                                        :key="book.id"
                                        :value="book.id"
                                    >
                                        {{ book.title }}
                                    </option>
                                </select>
                            </div>
                            <button
                                type="button"
                                @click="submitAssignment"
                                class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                :disabled="loading || !form.student_id || !form.teacher_id || !form.book_id"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

