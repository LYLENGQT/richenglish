<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { VideoCameraIcon, ArrowLeftIcon, CalendarIcon, UserIcon, BookOpenIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    recordingId: {
        type: [String, Number],
        required: true,
    },
});

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const canDelete = computed(() => ['super-admin', 'admin'].includes(role.value));

const loading = ref(true);
const recording = ref(null);
const deleting = ref(false);

const fetchRecording = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/recording/${props.recordingId}`);
        recording.value = data;
    } catch (error) {
        console.error('Error fetching recording:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
        return;
    }

    deleting.value = true;
    try {
        await api.delete(`/recording/${props.recordingId}`);
        router.visit(route('recordings.index'));
    } catch (error) {
        console.error('Error deleting recording:', error);
        alert('Failed to delete recording');
    } finally {
        deleting.value = false;
    }
};

const getRecordingUrl = () => {
    if (!recording.value) return null;
    if (recording.value.drive?.link) {
        return recording.value.drive.link;
    }
    if (recording.value.path) {
        return `/storage/${recording.value.path}`;
    }
    return null;
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

onMounted(fetchRecording);
</script>

<template>
    <Head title="Recording Details" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button
                        @click="router.visit(route('recordings.index'))"
                        class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">
                            Recording Details
                        </h2>
                        <p class="text-sm text-gray-500">
                            View and manage recording information.
                        </p>
                    </div>
                </div>
                <div v-if="canDelete" class="flex items-center gap-2">
                    <Button
                        @click="handleDelete"
                        variant="destructive"
                        :disabled="deleting"
                    >
                        {{ deleting ? 'Deleting...' : 'Delete Recording' }}
                    </Button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading" class="text-center py-12">
                    <p class="text-gray-500">Loading recording details...</p>
                </div>

                <div v-else-if="recording" class="space-y-6">
                    <!-- Recording Player -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <VideoCameraIcon class="h-5 w-5" />
                            Recording
                        </h3>
                        <div v-if="getRecordingUrl()" class="w-full">
                            <video
                                :src="getRecordingUrl()"
                                controls
                                class="w-full rounded-lg"
                                style="max-height: 600px;"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div v-else class="text-center py-12 text-gray-500">
                            <p>Recording file not available.</p>
                            <p v-if="recording.drive?.link" class="mt-2">
                                <a
                                    :href="recording.drive.link"
                                    target="_blank"
                                    class="text-blue-600 hover:text-blue-800"
                                >
                                    Open in Google Drive
                                </a>
                            </p>
                        </div>
                    </div>

                    <!-- Recording Information -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recording Information</h3>
                        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Filename</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.filename ?? '—' }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Uploaded By</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.uploader?.name ?? 'Unknown' }}
                                    <span v-if="recording.uploader?.email" class="text-gray-500">
                                        ({{ recording.uploader.email }})
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Uploaded At</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ formatDate(recording.created_at) }}
                                </dd>
                            </div>
                            <div v-if="recording.drive?.link">
                                <dt class="text-sm font-medium text-gray-500">Google Drive Link</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    <a
                                        :href="recording.drive.link"
                                        target="_blank"
                                        class="text-blue-600 hover:text-blue-800"
                                    >
                                        Open in Google Drive
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Class Information -->
                    <div v-if="recording.classSchedule" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarIcon class="h-5 w-5" />
                            Class Information
                        </h3>
                        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Teacher</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.classSchedule.teacher?.name ?? '—' }}
                                    <span v-if="recording.classSchedule.teacher?.email" class="text-gray-500">
                                        ({{ recording.classSchedule.teacher.email }})
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Student</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.classSchedule.student?.name ?? '—' }}
                                    <span v-if="recording.classSchedule.student?.email" class="text-gray-500">
                                        ({{ recording.classSchedule.student.email }})
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Date & Time</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.classSchedule.start_date }} {{ recording.classSchedule.start_time }} - {{ recording.classSchedule.end_time }}
                                </dd>
                            </div>
                            <div v-if="recording.classSchedule.book">
                                <dt class="text-sm font-medium text-gray-500">Book</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.classSchedule.book.title }}
                                </dd>
                            </div>
                        </dl>
                        <div class="mt-4">
                            <Button
                                @click="router.visit(route('classes.show', recording.classSchedule.id))"
                                variant="outline"
                                size="sm"
                            >
                                View Class Details
                            </Button>
                        </div>
                    </div>

                    <!-- Attendance Information -->
                    <div v-if="recording.attendance" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Attendance Information</h3>
                        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Date</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.attendance.date ?? '—' }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Duration</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ recording.attendance.duration ?? '—' }} minutes
                                </dd>
                            </div>
                        </dl>
                        <div class="mt-4">
                            <Button
                                @click="router.visit(route('attendance.show', recording.attendance.id))"
                                variant="outline"
                                size="sm"
                            >
                                View Attendance Details
                            </Button>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-12">
                    <p class="text-gray-500">Recording not found.</p>
                    <Button
                        @click="router.visit(route('recordings.index'))"
                        variant="outline"
                        class="mt-4"
                    >
                        Back to List
                    </Button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

