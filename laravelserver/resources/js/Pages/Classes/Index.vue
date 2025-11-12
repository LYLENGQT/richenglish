<script setup>
import { reactive, ref, onMounted } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);
const teacherOptions = ref([]);
const studentOptions = ref([]);

const filters = reactive({
    teacher_id: '',
    student_id: '',
    type: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 10,
});

const loadFilters = async () => {
    const [teachersRes, studentsRes] = await Promise.all([
        api.get('/dashboard/teachers'),
        api.get('/dashboard/students'),
    ]);
    teacherOptions.value = teachersRes.data;
    studentOptions.value = studentsRes.data;
};

const fetchClasses = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/class', { params: filters });
        rows.value = data.classes;
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
    fetchClasses();
};

const resetFilters = () => {
    filters.teacher_id = '';
    filters.student_id = '';
    filters.type = '';
    filters.start_date = '';
    filters.end_date = '';
    filters.page = 1;
    fetchClasses();
};

onMounted(async () => {
    await loadFilters();
    await fetchClasses();
});
</script>

<template>
    <Head title="Classes" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Classes
                    </h2>
                    <p class="text-sm text-gray-500">
                        Review upcoming schedules, recurring lessons, and make-up classes.
                    </p>
                </div>
                <button
                    @click="fetchClasses"
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
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Teacher
                            </label>
                            <select
                                v-model="filters.teacher_id"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Any</option>
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
                                <option value="">Any</option>
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
                                Type
                            </label>
                            <select
                                v-model="filters.type"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Any</option>
                                <option value="schedule">Schedule</option>
                                <option value="reoccurring">Recurring</option>
                                <option value="makeupClass">Make-up</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Start After
                            </label>
                            <input
                                v-model="filters.start_date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                End Before
                            </label>
                            <input
                                v-model="filters.end_date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="flex items-end gap-3">
                            <button
                                type="button"
                                @click="fetchClasses"
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
                                        Class
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Schedule
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Platform
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Details
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!loading && rows.length === 0">
                                    <td
                                        colspan="5"
                                        class="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No classes found.
                                    </td>
                                </tr>
                                <tr
                                    v-for="item in rows"
                                    :key="item.id"
                                    class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    @click="router.visit(route('classes.show', item.id))"
                                >
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">
                                            {{ item.student?.name ?? '—' }}
                                        </div>
                                        <div class="text-gray-500">
                                            Teacher: {{ item.teacher?.name ?? '—' }}
                                        </div>
                                        <div class="text-xs text-gray-400">
                                            Type: {{ item.type }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div>
                                            {{ item.start_date ?? '—' }}
                                            <span class="text-xs text-gray-400">
                                                ({{ item.start_time }} - {{ item.end_time }})
                                            </span>
                                        </div>
                                        <div v-if="item.type === 'reoccurring'" class="text-xs text-gray-500">
                                            Days: {{ item.reoccurring_days?.join(', ') ?? '—' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm">
                                            Link:
                                            <a
                                                v-if="item.platform_link"
                                                :href="item.platform_link"
                                                target="_blank"
                                                class="text-indigo-600 hover:text-indigo-500"
                                            >
                                                Join
                                            </a>
                                            <span v-else>—</span>
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            Duration: {{ item.duration }} mins
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="space-y-1 text-xs text-gray-500">
                                            <div v-if="item.reason">
                                                <span class="font-semibold text-gray-600">Reason:</span>
                                                {{ item.reason }}
                                            </div>
                                            <div v-if="item.note">
                                                <span class="font-semibold text-gray-600">Note:</span>
                                                {{ item.note }}
                                            </div>
                                            <div v-if="item.book">
                                                <span class="font-semibold text-gray-600">Book:</span>
                                                {{ item.book.title }}
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4" @click.stop>
                                        <button
                                            @click="router.visit(route('classes.show', item.id))"
                                            class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                        >
                                            View
                                        </button>
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

