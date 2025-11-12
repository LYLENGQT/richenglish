<script setup>
import { ref, computed, onMounted } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Calendar from '@/Components/Calendar.vue';
import api from '@/lib/api';

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const userId = computed(() => page.props.auth?.user?.id);

const loading = ref(false);
const classes = ref([]);
const formattedDates = ref([]);

const formatClassForCalendar = (classItem) => {
    if (!classItem.start_date) return null;

    const date = new Date(classItem.start_date);
    const style = {
        backgroundColor: classItem.type === 'makeupClass' ? '#ef4444' : classItem.type === 'reoccurring' ? '#8b5cf6' : '#22c55e',
        color: 'white',
    };

    return {
        id: classItem.id,
        date,
        type: classItem.type,
        startTime: classItem.start_time,
        endTime: classItem.end_time,
        style,
        onClick: (id) => {
            if (classItem.type === 'makeupClass') {
                router.visit(route('makeup-classes.show', id));
            } else {
                router.visit(route('classes.show', id));
            }
        },
        onHover: (data) => {
            return `
                <div class="text-xs">
                    <p class="font-semibold">${classItem.student?.name || 'Class'}</p>
                    ${data.startTime ? `<p class="text-gray-300">${data.startTime} - ${data.endTime}</p>` : ''}
                </div>
            `;
        },
        meta: classItem,
    };
};

const fetchClasses = async () => {
    loading.value = true;
    try {
        const params = {
            teacher_id: role.value === 'teacher' ? userId.value : undefined,
            limit: 1000, // Get all classes for the calendar
        };
        const { data } = await api.get('/class', { params });
        classes.value = data.classes || [];
        
        // Format classes for calendar
        formattedDates.value = classes.value
            .map(formatClassForCalendar)
            .filter(Boolean);
    } catch (error) {
        console.error('Error fetching classes:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchClasses);
</script>

<template>
    <Head title="My Schedule" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        My Schedule
                    </h2>
                    <p class="text-sm text-gray-500">
                        View all your classes in a calendar format.
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
                <div v-if="loading" class="text-center py-12">
                    <p class="text-gray-500">Loading schedule...</p>
                </div>

                <div v-else class="space-y-6">
                    <!-- Calendar -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <Calendar :dates="formattedDates" size="full" />
                    </div>

                    <!-- Legend -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
                        <div class="flex flex-wrap gap-4">
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 rounded bg-green-500"></div>
                                <span class="text-sm text-gray-700">Scheduled Classes</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 rounded bg-purple-500"></div>
                                <span class="text-sm text-gray-700">Recurring Classes</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 rounded bg-red-500"></div>
                                <span class="text-sm text-gray-700">Makeup Classes</span>
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Classes List -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
                        <div v-if="classes.length === 0" class="text-center py-8 text-gray-500">
                            No classes scheduled.
                        </div>
                        <div v-else class="space-y-2">
                            <div
                                v-for="classItem in classes.slice(0, 10)"
                                :key="classItem.id"
                                class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                                @click="classItem.type === 'makeupClass' ? router.visit(route('makeup-classes.show', classItem.id)) : router.visit(route('classes.show', classItem.id))"
                            >
                                <div>
                                    <div class="font-medium text-gray-900">
                                        {{ classItem.student?.name || 'Unknown Student' }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ classItem.start_date }} {{ classItem.start_time }} - {{ classItem.end_time }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span
                                        :class="[
                                            'px-2 py-1 text-xs font-medium rounded',
                                            classItem.type === 'makeupClass' ? 'bg-red-100 text-red-800' :
                                            classItem.type === 'reoccurring' ? 'bg-purple-100 text-purple-800' :
                                            'bg-green-100 text-green-800',
                                        ]"
                                    >
                                        {{ classItem.type }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

