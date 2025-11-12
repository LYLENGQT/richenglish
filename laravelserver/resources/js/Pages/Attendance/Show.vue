<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ attendanceId: { type: [String, Number], required: true } });
const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const canEdit = computed(() => ['admin', 'super-admin'].includes(role.value));

const loading = ref(false);
const attendance = ref(null);

const fetchAttendance = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/attendance/${props.attendanceId}`);
        attendance.value = data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const formatTime = (time) => time ?? '—';

onMounted(fetchAttendance);
</script>

<template>
    <Head :title="attendance ? `Attendance Details` : 'Attendance Details'" />
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center gap-4">
                <button @click="router.visit(route('attendance.index'))" class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <ArrowLeftIcon class="h-5 w-5" />
                </button>
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">Attendance Details</h2>
                    <p class="text-sm text-gray-500">{{ formatDate(attendance?.date) }}</p>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !attendance" class="text-center py-12 text-gray-500">Loading attendance information...</div>
                <template v-else-if="attendance">
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900">Attendance Information</h3></div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div><dt class="text-sm font-medium text-gray-500">Date</dt><dd class="mt-1 text-sm text-gray-900">{{ formatDate(attendance.date) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Teacher</dt><dd class="mt-1 text-sm text-gray-900">{{ attendance.teacher?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Student</dt><dd class="mt-1 text-sm text-gray-900">{{ attendance.student?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Duration</dt><dd class="mt-1 text-sm text-gray-900">{{ attendance.duration ?? '—' }} min</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Minutes Attended</dt><dd class="mt-1 text-sm text-gray-900">{{ attendance.minutes_attended ?? '—' }} min</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Hours</dt><dd class="mt-1 text-sm text-gray-900">{{ attendance.hours ?? '—' }} hrs</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Start Time</dt><dd class="mt-1 text-sm text-gray-900">{{ formatTime(attendance.start_time) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">End Time</dt><dd class="mt-1 text-sm text-gray-900">{{ formatTime(attendance.end_time) }}</dd></div>
                                <div class="sm:col-span-2 lg:col-span-3"><dt class="text-sm font-medium text-gray-500">Notes</dt><dd class="mt-1 text-sm text-gray-900">{{ attendance.notes ?? '—' }}</dd></div>
                            </dl>
                        </div>
                    </div>

                    <div v-if="attendance.screenshots && attendance.screenshots.length > 0" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2"><PhotoIcon class="h-5 w-5" />Screenshots ({{ attendance.screenshots.length }})</h3></div>
                        <div class="px-6 py-4 text-center py-8 text-gray-500">Screenshots gallery - to be implemented</div>
                    </div>

                    <div v-if="attendance.recording" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2"><VideoCameraIcon class="h-5 w-5" />Recording</h3></div>
                        <div class="px-6 py-4 text-center py-8 text-gray-500">Recording player - to be implemented</div>
                    </div>
                </template>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

