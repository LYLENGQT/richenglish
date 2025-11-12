<script setup>
import { ref, onMounted } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { ArrowLeftIcon, CalendarIcon, UserIcon, BookOpenIcon, ClipboardDocumentListIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ classId: { type: [String, Number], required: true } });
const loading = ref(false);
const classData = ref(null);

const fetchClass = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/class/${props.classId}`);
        classData.value = data;
    } catch (error) {
        console.error('Error fetching class:', error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const formatTime = (time) => time ?? '—';

onMounted(fetchClass);
</script>

<template>
    <Head :title="classData ? `Class Details` : 'Class Details'" />
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center gap-4">
                <button @click="router.visit(route('classes.index'))" class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <ArrowLeftIcon class="h-5 w-5" />
                </button>
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">Class Details</h2>
                    <p class="text-sm text-gray-500">{{ classData?.type ?? 'Loading...' }}</p>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !classData" class="text-center py-12 text-gray-500">Loading class information...</div>
                <template v-else-if="classData">
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900">Class Information</h3></div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div><dt class="text-sm font-medium text-gray-500">Type</dt><dd class="mt-1 text-sm text-gray-900">{{ classData.type ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Teacher</dt><dd class="mt-1 text-sm text-gray-900">{{ classData.teacher?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Student</dt><dd class="mt-1 text-sm text-gray-900">{{ classData.student?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Start Date</dt><dd class="mt-1 text-sm text-gray-900">{{ formatDate(classData.start_date) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">End Date</dt><dd class="mt-1 text-sm text-gray-900">{{ formatDate(classData.end_date) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Time</dt><dd class="mt-1 text-sm text-gray-900">{{ formatTime(classData.start_time) }} - {{ formatTime(classData.end_time) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Book</dt><dd class="mt-1 text-sm text-gray-900">{{ classData.book?.title ?? '—' }}</dd></div>
                            </dl>
                        </div>
                    </div>

                    <div v-if="classData.attendances && classData.attendances.length > 0" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2"><ClipboardDocumentListIcon class="h-5 w-5" />Attendance ({{ classData.attendances.length }})</h3></div>
                        <div class="px-6 py-4">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50"><tr>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duration</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Minutes Attended</th>
                                    </tr></thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr v-for="attendance in classData.attendances" :key="attendance.id" class="hover:bg-gray-50 cursor-pointer" @click="router.visit(route('attendance.show', attendance.id))">
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(attendance.date) }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ attendance.duration ?? '—' }} min</td>
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ attendance.minutes_attended ?? '—' }} min</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div v-if="classData.recordings && classData.recordings.length > 0" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2"><VideoCameraIcon class="h-5 w-5" />Recordings ({{ classData.recordings.length }})</h3></div>
                        <div class="px-6 py-4 text-center py-8 text-gray-500">Recordings list - to be implemented</div>
                    </div>

                    <div v-if="classData.screenshots && classData.screenshots.length > 0" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2"><PhotoIcon class="h-5 w-5" />Screenshots ({{ classData.screenshots.length }})</h3></div>
                        <div class="px-6 py-4 text-center py-8 text-gray-500">Screenshots list - to be implemented</div>
                    </div>
                </template>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

