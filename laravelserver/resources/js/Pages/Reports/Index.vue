<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { FolderOpenIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline';

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const userId = computed(() => page.props.auth?.user?.id);

const loading = ref(false);
const reportData = ref(null);
const teacherOptions = ref([]);
const studentOptions = ref([]);

const filters = reactive({
    type: role.value === 'teacher' ? 'attendance' : 'attendance',
    start_date: '',
    end_date: '',
    teacher_id: role.value === 'teacher' ? userId.value : '',
    student_id: '',
});

const reportTypes = computed(() => {
    if (role.value === 'teacher') {
        return [
            { value: 'attendance', label: 'Attendance Report' },
            { value: 'classes', label: 'Classes Report' },
        ];
    }
    return [
        { value: 'attendance', label: 'Attendance Report' },
        { value: 'classes', label: 'Classes Report' },
        { value: 'payouts', label: 'Payouts Report' },
        { value: 'students', label: 'Students Report' },
    ];
});

const loadFilters = async () => {
    try {
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
    } catch (error) {
        console.error('Error loading filters:', error);
    }
};

const generateReport = async () => {
    loading.value = true;
    try {
        const params = { ...filters };
        if (role.value === 'teacher') {
            params.teacher_id = userId.value;
        }
        const { data } = await api.get('/reports', { params });
        reportData.value = data;
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        loading.value = false;
    }
};

const resetFilters = () => {
    filters.type = role.value === 'teacher' ? 'attendance' : 'attendance';
    filters.start_date = '';
    filters.end_date = '';
    filters.teacher_id = role.value === 'teacher' ? userId.value : '';
    filters.student_id = '';
    reportData.value = null;
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const exportReport = () => {
    // TODO: Implement CSV/PDF export
    alert('Export functionality coming soon');
};

onMounted(loadFilters);
</script>

<template>
    <Head title="Reports" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Reports
                    </h2>
                    <p class="text-sm text-gray-500">
                        Generate and view reports based on your data.
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <Button
                        v-if="reportData"
                        @click="exportReport"
                        variant="outline"
                        :disabled="loading"
                    >
                        <DocumentArrowDownIcon class="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <button
                        @click="generateReport"
                        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        :disabled="loading"
                    >
                        {{ loading ? 'Generating...' : 'Generate Report' }}
                    </button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <!-- Report Filters -->
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
                    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Report Type
                            </label>
                            <select
                                v-model="filters.type"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option
                                    v-for="type in reportTypes"
                                    :key="type.value"
                                    :value="type.value"
                                >
                                    {{ type.label }}
                                </option>
                            </select>
                        </div>
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
                                @click="generateReport"
                                class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                :disabled="loading"
                            >
                                {{ loading ? 'Generating...' : 'Generate Report' }}
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

                <!-- Report Summary -->
                <div v-if="reportData && reportData.summary" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div
                            v-for="(value, key) in reportData.summary"
                            :key="key"
                            class="bg-gray-50 rounded-lg p-4"
                        >
                            <dt class="text-sm font-medium text-gray-500 capitalize">
                                {{ key.replace(/_/g, ' ') }}
                            </dt>
                            <dd class="mt-1 text-2xl font-semibold text-gray-900">
                                {{ value }}
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Report Data -->
                <div v-if="reportData && reportData.data && reportData.data.length > 0" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-200 px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-900">
                            {{ reportData.report_type.charAt(0).toUpperCase() + reportData.report_type.slice(1) }} Report
                            <span class="text-sm font-normal text-gray-500">
                                ({{ reportData.data.length }} records)
                            </span>
                        </h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <template v-if="reportData.report_type === 'attendance'">
                                        <th class="px-6 py-3">Date</th>
                                        <th class="px-6 py-3">Teacher</th>
                                        <th class="px-6 py-3">Student</th>
                                        <th class="px-6 py-3">Duration</th>
                                        <th class="px-6 py-3">Minutes Attended</th>
                                    </template>
                                    <template v-else-if="reportData.report_type === 'classes'">
                                        <th class="px-6 py-3">Date & Time</th>
                                        <th class="px-6 py-3">Teacher</th>
                                        <th class="px-6 py-3">Student</th>
                                        <th class="px-6 py-3">Type</th>
                                        <th class="px-6 py-3">Book</th>
                                    </template>
                                    <template v-else-if="reportData.report_type === 'payouts'">
                                        <th class="px-6 py-3">Teacher</th>
                                        <th class="px-6 py-3">Period</th>
                                        <th class="px-6 py-3">Duration</th>
                                        <th class="px-6 py-3">Total Classes</th>
                                        <th class="px-6 py-3">Status</th>
                                    </template>
                                    <template v-else-if="reportData.report_type === 'students'">
                                        <th class="px-6 py-3">Name</th>
                                        <th class="px-6 py-3">Nationality</th>
                                        <th class="px-6 py-3">Total Classes</th>
                                        <th class="px-6 py-3">Total Attendance</th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr
                                    v-for="(item, index) in reportData.data"
                                    :key="index"
                                    class="text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <template v-if="reportData.report_type === 'attendance'">
                                        <td class="px-6 py-4">{{ formatDate(item.date) }}</td>
                                        <td class="px-6 py-4">{{ item.teacher?.name ?? '—' }}</td>
                                        <td class="px-6 py-4">{{ item.student?.name ?? '—' }}</td>
                                        <td class="px-6 py-4">{{ item.duration ?? '—' }} min</td>
                                        <td class="px-6 py-4">{{ item.minutes_attended ?? '—' }} min</td>
                                    </template>
                                    <template v-else-if="reportData.report_type === 'classes'">
                                        <td class="px-6 py-4">
                                            {{ formatDate(item.start_date) }} {{ item.start_time }} - {{ item.end_time }}
                                        </td>
                                        <td class="px-6 py-4">{{ item.teacher?.name ?? '—' }}</td>
                                        <td class="px-6 py-4">{{ item.student?.name ?? '—' }}</td>
                                        <td class="px-6 py-4">
                                            <span
                                                :class="[
                                                    'px-2 py-1 text-xs font-medium rounded',
                                                    item.type === 'makeupClass' ? 'bg-red-100 text-red-800' :
                                                    item.type === 'reoccurring' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800',
                                                ]"
                                            >
                                                {{ item.type }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">{{ item.book?.title ?? '—' }}</td>
                                    </template>
                                    <template v-else-if="reportData.report_type === 'payouts'">
                                        <td class="px-6 py-4">{{ item.teacher?.name ?? '—' }}</td>
                                        <td class="px-6 py-4">
                                            {{ formatDate(item.start_date) }} - {{ formatDate(item.end_date) }}
                                        </td>
                                        <td class="px-6 py-4">{{ item.duration ?? '—' }} hours</td>
                                        <td class="px-6 py-4">{{ item.total_class ?? '—' }}</td>
                                        <td class="px-6 py-4">
                                            <span
                                                :class="[
                                                    'px-2 py-1 text-xs font-medium rounded',
                                                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800',
                                                ]"
                                            >
                                                {{ item.status }}
                                            </span>
                                        </td>
                                    </template>
                                    <template v-else-if="reportData.report_type === 'students'">
                                        <td class="px-6 py-4">{{ item.name }}</td>
                                        <td class="px-6 py-4">{{ item.nationality ?? '—' }}</td>
                                        <td class="px-6 py-4">{{ item.classes?.length ?? 0 }}</td>
                                        <td class="px-6 py-4">{{ item.attendances?.length ?? 0 }}</td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="!loading && !reportData" class="text-center py-12">
                    <FolderOpenIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No report generated</h3>
                    <p class="mt-1 text-sm text-gray-500">Select filters and click "Generate Report" to view data.</p>
                </div>

                <div v-else-if="reportData && reportData.data && reportData.data.length === 0" class="text-center py-12">
                    <FolderOpenIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No data found</h3>
                    <p class="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

