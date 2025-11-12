<script setup>
import { computed, onMounted, ref } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import DashboardHeader from '@/Components/DashboardHeader.vue';
import {
    UserGroupIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
} from '@heroicons/vue/24/outline';
import api from '@/lib/api';

const page = usePage();
const loading = ref(false);
const stats = ref(null);
const hasLoaded = ref(false);

const role = computed(() => page.props.auth?.user?.role ?? 'teacher');

// For teacher dashboard - match legacy structure
const statCards = computed(() => {
    if (!stats.value || role.value !== 'teacher') return [];

    const data = stats.value.stats ?? {};
    const dashboard = data.dashboard ?? {};
    
    const totalStudents = dashboard.students ?? 0;
    const activeClassesCount = Array.isArray(dashboard.activeClass)
        ? dashboard.activeClass.filter((item) => item !== null).length
        : dashboard.activeClass && dashboard.activeClass !== null
        ? 1
        : 0;
    
    const todayAttendanceCount = Array.isArray(dashboard.todayAttendance)
        ? dashboard.todayAttendance.filter((item) => item !== null).length
        : dashboard.todayAttendance && dashboard.todayAttendance !== null
        ? 1
        : 0;
    
    const pendingMakeupsCount = Array.isArray(dashboard.pendingMakeups)
        ? dashboard.pendingMakeups.filter((item) => item !== null).length
        : dashboard.pendingMakeups && dashboard.pendingMakeups !== null
        ? 1
        : 0;

    return [
        {
            name: 'Total Students',
            value: totalStudents,
            icon: UserGroupIcon,
            color: 'bg-blue-500',
        },
        {
            name: 'Active Classes',
            value: activeClassesCount,
            icon: CalendarIcon,
            color: 'bg-green-500',
        },
        {
            name: "Today's Attendance",
            value: todayAttendanceCount,
            icon: ClipboardDocumentListIcon,
            color: 'bg-yellow-500',
        },
        {
            name: 'Pending Makeups',
            value: pendingMakeupsCount,
            icon: ClockIcon,
            color: 'bg-red-500',
        },
    ];
});

// For admin and super-admin - use existing structure
const cards = computed(() => {
    if (!stats.value || role.value === 'teacher') return [];

    const data = stats.value.stats ?? {};

    const mapping = {
        'super-admin': [
            { label: 'Admins', value: data.totalAdmins },
            { label: 'Teachers', value: data.totalTeachers },
            { label: 'Students', value: data.totalStudents },
            { label: 'Books', value: data.totalBooks },
            { label: 'Classes', value: data.totalClasses },
            { label: 'Payouts', value: data.totalPayouts },
            { label: 'Notifications', value: data.totalNotifications },
            { label: 'Book Assignments', value: data.totalBookAssignments },
        ],
        admin: [
            { label: 'Assigned Teachers', value: data.assignedTeachers },
            { label: 'Students', value: data.totalStudents },
            { label: 'Books', value: data.totalBooks },
            { label: 'Classes Created', value: data.totalClasses },
            { label: 'Notifications', value: data.totalNotifications },
            { label: 'Payouts', value: data.totalPayouts },
            { label: 'Hours This Month', value: data.totalHoursMonth },
            { label: 'Hours This Week', value: data.totalHoursWeek },
            {
                label: 'Estimated Month Payout',
                value: `₱${Number(data.totalPaymentMonth ?? 0).toFixed(2)}`,
            },
        ],
    };

    return mapping[role.value] ?? [];
});

const loadStats = async () => {
    if (loading.value || hasLoaded.value) return;
    
    loading.value = true;
    try {
        const { data } = await api.get('/dashboard/stats');
        stats.value = data;
        hasLoaded.value = true;
    } catch (error) {
        console.error('Dashboard stats error:', error);
        if (error.response?.status === 401) {
            console.warn('Unauthorized - user may need to re-login');
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (!hasLoaded.value && !loading.value) {
        loadStats();
    }
});
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <div class="space-y-6">
            <DashboardHeader />

            <!-- Loading State -->
            <div v-if="loading" class="space-y-6">
                <div class="w-full h-96 mb-12 mt-5 bg-gray-200 animate-pulse rounded"></div>
                <div class="w-full h-96 bg-gray-200 animate-pulse rounded"></div>
            </div>

            <!-- Teacher Dashboard -->
            <template v-else-if="role === 'teacher'">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="card in statCards"
                        :key="card.name"
                        class="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div :class="[card.color, 'p-3 rounded-md']">
                                        <component
                                            :is="card.icon"
                                            class="h-6 w-6 text-white"
                                        />
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">
                                            {{ card.name }}
                                        </dt>
                                        <dd class="text-lg font-medium text-gray-900">
                                            {{ card.value }}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Calendar Section (placeholder for now) -->
                <div class="flex flex-col-reverse lg:flex-row gap-6">
                    <div class="w-full lg:w-2/3">
                        <div class="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto">
                            <!-- Content area - can be populated later -->
                        </div>
                    </div>

                    <div class="w-full lg:w-1/3">
                        <div class="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-visible">
                            <!-- Calendar placeholder - can add DynamicCalendar component later -->
                            <div class="text-center text-gray-500 py-8">
                                Calendar will be displayed here
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Admin and Super-Admin Dashboard -->
            <template v-else>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="card in cards"
                        :key="card.label"
                        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <dt class="text-sm font-medium text-gray-500">
                            {{ card.label }}
                        </dt>
                        <dd class="mt-2 text-3xl font-semibold text-gray-900">
                            {{ card.value ?? 0 }}
                        </dd>
                    </div>
                </div>
            </template>
        </div>
    </AuthenticatedLayout>
</template>
