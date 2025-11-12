<script setup>
import { reactive, ref, onMounted } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);

const filters = reactive({
    teacher_id: '',
    student_id: '',
    class_id: '',
    date: '',
    page: 1,
    limit: 10,
});

const fetchAttendance = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/attendance', { params: filters });
        rows.value = data.attendances;
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
    fetchAttendance();
};

const resetFilters = () => {
    filters.teacher_id = '';
    filters.student_id = '';
    filters.class_id = '';
    filters.date = '';
    filters.page = 1;
    fetchAttendance();
};

const durationLabel = (att) => `${att.duration} mins • ${att.hours ?? 0} hrs`;

onMounted(fetchAttendance);
</script>

<template>
    <Head title="Attendance" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Attendance
                    </h2>
                    <p class="text-sm text-gray-500">
                        Track class participation, uploaded evidence, and notes from each session.
                    </p>
                </div>
                <button
                    @click="fetchAttendance"
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
                                Teacher ID
                            </label>
                            <input
                                v-model="filters.teacher_id"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Teacher ID"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Student ID
                            </label>
                            <input
                                v-model="filters.student_id"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Student ID"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Class ID
                            </label>
                            <input
                                v-model="filters.class_id"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Class ID"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                v-model="filters.date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="flex items-end gap-3">
                            <button
                                type="button"
                                @click="fetchAttendance"
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
                                        Attendance
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Notes
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Evidence
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
                                        No attendance records found.
                                    </td>
                                </tr>
                                <tr
                                    v-for="item in rows"
                                    :key="item.id"
                                    class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    @click="router.visit(route('attendance.show', item.id))"
                                >
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">
                                            {{ item.class_id }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            Teacher: {{ item.teacher?.name ?? '—' }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            Student: {{ item.student?.name ?? '—' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">
                                            {{ new Date(item.date).toLocaleDateString() }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {{ durationLabel(item) }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            Minutes attended: {{ item.minutes_attended ?? '—' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ item.notes ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="space-y-1 text-xs text-indigo-600">
                                            <a
                                                v-if="item.recording"
                                                :href="`/storage/${item.recording.path}`"
                                                target="_blank"
                                                class="hover:underline"
                                            >
                                                Recording
                                            </a>
                                            <div
                                                v-if="item.screenshots?.length"
                                                class="flex flex-wrap gap-2"
                                            >
                                                <a
                                                    v-for="screenshot in item.screenshots"
                                                    :key="screenshot.id"
                                                    :href="`/storage/${screenshot.path}`"
                                                    target="_blank"
                                                    class="rounded border border-indigo-100 px-2 py-1 hover:underline"
                                                >
                                                    Screenshot
                                                </a>
                                            </div>
                                            <span v-if="!item.recording && !item.screenshots?.length" class="text-gray-500">
                                                —
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4" @click.stop>
                                        <button
                                            @click="router.visit(route('attendance.show', item.id))"
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

