<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { PhotoIcon, ArrowLeftIcon, CalendarIcon, UserIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    screenshotId: {
        type: [String, Number],
        required: true,
    },
});

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const canDelete = computed(() => ['super-admin', 'admin'].includes(role.value));

const loading = ref(true);
const screenshot = ref(null);
const deleting = ref(false);

const fetchScreenshot = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/screen-shot/${props.screenshotId}`);
        screenshot.value = data;
    } catch (error) {
        console.error('Error fetching screenshot:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this screenshot? This action cannot be undone.')) {
        return;
    }

    deleting.value = true;
    try {
        await api.delete(`/screen-shot/${props.screenshotId}`);
        router.visit(route('screenshots.index'));
    } catch (error) {
        console.error('Error deleting screenshot:', error);
        alert('Failed to delete screenshot');
    } finally {
        deleting.value = false;
    }
};

const getScreenshotUrl = () => {
    if (!screenshot.value) return null;
    if (screenshot.value.drive?.link) {
        return screenshot.value.drive.link;
    }
    if (screenshot.value.path) {
        return `/storage/${screenshot.value.path}`;
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

onMounted(fetchScreenshot);
</script>

<template>
    <Head title="Screenshot Details" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button
                        @click="router.visit(route('screenshots.index'))"
                        class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">
                            Screenshot Details
                        </h2>
                        <p class="text-sm text-gray-500">
                            View and manage screenshot information.
                        </p>
                    </div>
                </div>
                <div v-if="canDelete" class="flex items-center gap-2">
                    <Button
                        @click="handleDelete"
                        variant="destructive"
                        :disabled="deleting"
                    >
                        {{ deleting ? 'Deleting...' : 'Delete Screenshot' }}
                    </Button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading" class="text-center py-12">
                    <p class="text-gray-500">Loading screenshot details...</p>
                </div>

                <div v-else-if="screenshot" class="space-y-6">
                    <!-- Screenshot Image -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <PhotoIcon class="h-5 w-5" />
                            Screenshot
                        </h3>
                        <div v-if="getScreenshotUrl()" class="w-full">
                            <img
                                :src="getScreenshotUrl()"
                                :alt="screenshot.filename"
                                class="w-full rounded-lg shadow-lg max-h-[600px] object-contain mx-auto"
                            />
                        </div>
                        <div v-else class="text-center py-12 text-gray-500">
                            <PhotoIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p>Screenshot file not available.</p>
                            <p v-if="screenshot.drive?.link" class="mt-2">
                                <a
                                    :href="screenshot.drive.link"
                                    target="_blank"
                                    class="text-blue-600 hover:text-blue-800"
                                >
                                    Open in Google Drive
                                </a>
                            </p>
                        </div>
                    </div>

                    <!-- Screenshot Information -->
                    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Screenshot Information</h3>
                        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Filename</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.filename ?? '—' }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Uploaded By</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.uploader?.name ?? 'Unknown' }}
                                    <span v-if="screenshot.uploader?.email" class="text-gray-500">
                                        ({{ screenshot.uploader.email }})
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Uploaded At</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ formatDate(screenshot.created_at) }}
                                </dd>
                            </div>
                            <div v-if="screenshot.drive?.link">
                                <dt class="text-sm font-medium text-gray-500">Google Drive Link</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    <a
                                        :href="screenshot.drive.link"
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
                    <div v-if="screenshot.classSchedule" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarIcon class="h-5 w-5" />
                            Class Information
                        </h3>
                        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Teacher</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.classSchedule.teacher?.name ?? '—' }}
                                    <span v-if="screenshot.classSchedule.teacher?.email" class="text-gray-500">
                                        ({{ screenshot.classSchedule.teacher.email }})
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Student</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.classSchedule.student?.name ?? '—' }}
                                    <span v-if="screenshot.classSchedule.student?.email" class="text-gray-500">
                                        ({{ screenshot.classSchedule.student.email }})
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Date & Time</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.classSchedule.start_date }} {{ screenshot.classSchedule.start_time }} - {{ screenshot.classSchedule.end_time }}
                                </dd>
                            </div>
                            <div v-if="screenshot.classSchedule.book">
                                <dt class="text-sm font-medium text-gray-500">Book</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.classSchedule.book.title }}
                                </dd>
                            </div>
                        </dl>
                        <div class="mt-4">
                            <Button
                                @click="router.visit(route('classes.show', screenshot.classSchedule.id))"
                                variant="outline"
                                size="sm"
                            >
                                View Class Details
                            </Button>
                        </div>
                    </div>

                    <!-- Attendance Information -->
                    <div v-if="screenshot.attendance" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Attendance Information</h3>
                        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Date</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.attendance.date ?? '—' }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Duration</dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {{ screenshot.attendance.duration ?? '—' }} minutes
                                </dd>
                            </div>
                        </dl>
                        <div class="mt-4">
                            <Button
                                @click="router.visit(route('attendance.show', screenshot.attendance.id))"
                                variant="outline"
                                size="sm"
                            >
                                View Attendance Details
                            </Button>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-12">
                    <p class="text-gray-500">Screenshot not found.</p>
                    <Button
                        @click="router.visit(route('screenshots.index'))"
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

