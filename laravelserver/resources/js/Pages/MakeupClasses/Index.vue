<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const userId = computed(() => page.props.auth?.user?.id);

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);
const teacherOptions = ref([]);
const studentOptions = ref([]);

const filters = reactive({
    teacher_id: role.value === 'teacher' ? userId.value : '',
    student_id: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 10,
});

const loadFilters = async () => {
    if (role.value !== 'teacher') {
        const [teachersRes, studentsRes] = await Promise.all([
            api.get('/dashboard/teachers'),
            api.get('/dashboard/students'),
        ]);
        teacherOptions.value = teachersRes.data;
        studentOptions.value = studentsRes.data;
    } else {
        const studentsRes = await api.get('/dashboard/students');
        studentOptions.value = studentsRes.data;
    }
};

const fetchMakeupClasses = async () => {
    loading.value = true;
    try {
        const params = {
            ...filters,
            type: 'makeupClass', // Always filter for makeup classes
        };
        const { data } = await api.get('/class', { params });
        rows.value = data.classes;
        pagination.value = data.pagination;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const goToPage = (pageNum) => {
    if (!pagination.value) return;
    if (pageNum < 1 || pageNum > pagination.value.totalPages) return;
    filters.page = pageNum;
    fetchMakeupClasses();
};

const resetFilters = () => {
    filters.teacher_id = role.value === 'teacher' ? userId.value : '';
    filters.student_id = '';
    filters.start_date = '';
    filters.end_date = '';
    filters.page = 1;
    fetchMakeupClasses();
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
};

const formatTime = (timeString) => {
    if (!timeString) return '—';
    return timeString;
};

onMounted(async () => {
    await loadFilters();
    await fetchMakeupClasses();
});
</script>

<template>
    <Head title="Makeup Classes" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Makeup Classes
                    </h2>
                    <p class="text-sm text-gray-500">
                        Manage makeup classes scheduled to replace missed lessons.
                    </p>
                </div>
                <button
                    @click="fetchMakeupClasses"
                    class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    :disabled="loading"
                >
                    Refresh
                </button>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div v-if="role !== 'teacher'">
                            <label class="block text-sm font-medium text-gray-700">
                                Teacher
                            </label>
                            <select
                                v-model="filters.teacher_id"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All Teachers</option>
                                <option
                                    v-for="teacher in teacherOptions"
                                    :key="teacher.id"
                                    :value="teacher.id"
                                >
                                    {{ teacher.name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Student
                            </label>
                            <select
                                v-model="filters.student_id"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All Students</option>
                                <option
                                    v-for="student in studentOptions"
                                    :key="student.id"
                                    :value="student.id"
                                >
                                    {{ student.name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                v-model="filters.start_date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                v-model="filters.end_date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="flex items-end gap-3 sm:col-span-2 lg:col-span-4">
                            <button
                                type="button"
                                @click="fetchMakeupClasses"
                                class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                :disabled="loading"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                @click="resetFilters"
                                class="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                :disabled="loading"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th scope="col" class="px-6 py-3">
                                        Date & Time
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Teacher
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Student
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Book
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Reason
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Original Class
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!loading && rows.length === 0">
                                    <td
                                        colspan="7"
                                        class="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No makeup classes found.
                                    </td>
                                </tr>
                                <tr
                                    v-for="makeupClass in rows"
                                    :key="makeupClass.id"
                                    class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    @click="router.visit(route('makeup-classes.show', makeupClass.id))"
                                >
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">
                                            {{ formatDate(makeupClass.start_date) }}
                                        </div>
                                        <div class="text-gray-500">
                                            {{ formatTime(makeupClass.start_time) }} - {{ formatTime(makeupClass.end_time) }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ makeupClass.teacher?.name ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ makeupClass.student?.name ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ makeupClass.book?.title ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="max-w-xs truncate" :title="makeupClass.reason">
                                            {{ makeupClass.reason ?? '—' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span v-if="makeupClass.original_class_id" class="text-blue-600">
                                            Class #{{ makeupClass.original_class_id }}
                                        </span>
                                        <span v-else class="text-gray-400">—</span>
                                    </td>
                                    <td class="px-6 py-4" @click.stop>
                                        <Button
                                            @click="router.visit(route('makeup-classes.show', makeupClass.id))"
                                            variant="outline"
                                            size="sm"
                                        >
                                            View
                                        </Button>
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
        </div>
    </AuthenticatedLayout>
</template>

