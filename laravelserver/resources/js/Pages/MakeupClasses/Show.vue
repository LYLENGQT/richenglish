<script setup>
import { ref, onMounted } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';

const props = defineProps({
    classId: {
        type: [String, Number],
        required: true,
    },
});

const loading = ref(true);
const makeupClass = ref(null);

const fetchMakeupClass = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/class/${props.classId}`);
        makeupClass.value = data;
    } catch (error) {
        console.error('Error fetching makeup class:', error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatTime = (timeString) => {
    if (!timeString) return '—';
    return timeString;
};

onMounted(fetchMakeupClass);
</script>

<template>
    <Head title="Makeup Class Details" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Makeup Class Details
                    </h2>
                    <p class="text-sm text-gray-500">
                        View detailed information about this makeup class.
                    </p>
                </div>
                <Button
                    @click="router.visit(route('makeup-classes.index'))"
                    variant="outline"
                >
                    Back to List
                </Button>
            </div>
        </template>

        <div class="py-10">
            <div v-if="loading" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="text-center py-12">
                    <p class="text-gray-500">Loading makeup class details...</p>
                </div>
            </div>

            <div v-else-if="makeupClass" class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <!-- Main Information Card -->
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Class Information</h3>
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Date</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ formatDate(makeupClass.start_date) }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Time</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ formatTime(makeupClass.start_time) }} - {{ formatTime(makeupClass.end_time) }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Duration</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ makeupClass.duration ?? '—' }} minutes
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Platform</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                <a
                                    v-if="makeupClass.platform_link"
                                    :href="makeupClass.platform_link"
                                    target="_blank"
                                    class="text-blue-600 hover:text-blue-800"
                                >
                                    {{ makeupClass.platform_link }}
                                </a>
                                <span v-else>—</span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Participants Card -->
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Teacher</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ makeupClass.teacher?.name ?? '—' }}
                                <span v-if="makeupClass.teacher?.email" class="text-gray-500">
                                    ({{ makeupClass.teacher.email }})
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Student</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ makeupClass.student?.name ?? '—' }}
                                <span v-if="makeupClass.student?.email" class="text-gray-500">
                                    ({{ makeupClass.student.email }})
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Book Information Card -->
                <div v-if="makeupClass.book" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Book</h3>
                    <dl class="grid grid-cols-1 gap-4">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Title</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ makeupClass.book.title }}
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Makeup Class Details Card -->
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Makeup Class Details</h3>
                    <dl class="grid grid-cols-1 gap-4">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Reason</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ makeupClass.reason ?? '—' }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Notes</dt>
                            <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                {{ makeupClass.note ?? '—' }}
                            </dd>
                        </div>
                        <div v-if="makeupClass.original_class_id">
                            <dt class="text-sm font-medium text-gray-500">Original Class</dt>
                            <dd class="mt-1">
                                <Button
                                    @click="router.visit(route('classes.show', makeupClass.original_class_id))"
                                    variant="outline"
                                    size="sm"
                                >
                                    View Original Class #{{ makeupClass.original_class_id }}
                                </Button>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div v-else class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="text-center py-12">
                    <p class="text-gray-500">Makeup class not found.</p>
                    <Button
                        @click="router.visit(route('makeup-classes.index'))"
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

