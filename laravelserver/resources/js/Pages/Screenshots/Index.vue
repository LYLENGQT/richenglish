<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { PhotoIcon } from '@heroicons/vue/24/outline';

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const userId = computed(() => page.props.auth?.user?.id);

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);
const classOptions = ref([]);

const filters = reactive({
    class_id: '',
    attendance_id: '',
    page: 1,
    limit: 20,
});

const loadFilters = async () => {
    try {
        const { data } = await api.get('/class', {
            params: {
                teacher_id: role.value === 'teacher' ? userId.value : undefined,
                limit: 100,
            },
        });
        classOptions.value = data.classes || [];
    } catch (error) {
        console.error('Error loading filters:', error);
    }
};

const fetchScreenshots = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/screen-shot', { params: filters });
        rows.value = data.screenshots;
        pagination.value = data.pagination;
    } catch (error) {
        console.error('Error fetching screenshots:', error);
    } finally {
        loading.value = false;
    }
};

const goToPage = (pageNum) => {
    if (!pagination.value) return;
    if (pageNum < 1 || pageNum > pagination.value.totalPages) return;
    filters.page = pageNum;
    fetchScreenshots();
};

const resetFilters = () => {
    filters.class_id = '';
    filters.attendance_id = '';
    filters.page = 1;
    fetchScreenshots();
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getScreenshotUrl = (screenshot) => {
    if (screenshot.drive?.link) {
        return screenshot.drive.link;
    }
    if (screenshot.path) {
        return `/storage/${screenshot.path}`;
    }
    return null;
};

onMounted(async () => {
    await loadFilters();
    await fetchScreenshots();
});
</script>

<template>
    <Head title="Screenshots" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Screenshots
                    </h2>
                    <p class="text-sm text-gray-500">
                        View and manage class screenshots.
                    </p>
                </div>
                <button
                    @click="fetchScreenshots"
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
                    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Class
                            </label>
                            <select
                                v-model="filters.class_id"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All Classes</option>
                                <option
                                    v-for="classItem in classOptions"
                                    :key="classItem.id"
                                    :value="classItem.id"
                                >
                                    {{ classItem.student?.name ?? 'Unknown' }} - {{ classItem.start_date }}
                                </option>
                            </select>
                        </div>
                        <div class="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
                            <button
                                type="button"
                                @click="fetchScreenshots"
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

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div
                        v-for="screenshot in rows"
                        :key="screenshot.id"
                        class="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        @click="router.visit(route('screenshots.show', screenshot.id))"
                    >
                        <div class="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                                v-if="getScreenshotUrl(screenshot)"
                                :src="getScreenshotUrl(screenshot)"
                                :alt="screenshot.filename"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                <PhotoIcon class="h-12 w-12" />
                                <span class="text-xs mt-2">No preview</span>
                            </div>
                        </div>
                        <div class="p-3">
                            <div class="text-xs font-medium text-gray-900 truncate">
                                {{ screenshot.filename ?? 'Untitled Screenshot' }}
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                {{ formatDate(screenshot.created_at) }}
                            </div>
                            <div v-if="screenshot.classSchedule" class="text-xs text-gray-500 mt-1">
                                {{ screenshot.classSchedule.student?.name ?? 'Unknown' }}
                            </div>
                        </div>
                        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                @click.stop="router.visit(route('screenshots.show', screenshot.id))"
                                variant="outline"
                                size="sm"
                                class="bg-white/90 backdrop-blur-sm"
                            >
                                View
                            </Button>
                        </div>
                    </div>
                </div>

                <div v-if="!loading && rows.length === 0" class="text-center py-12">
                    <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No screenshots</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by uploading a screenshot.</p>
                </div>

                <div
                    v-if="pagination && rows.length > 0"
                    class="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 text-sm text-gray-600 sm:flex-row"
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
    </AuthenticatedLayout>
</template>

