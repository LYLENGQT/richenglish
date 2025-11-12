<script setup>
import { Head } from '@inertiajs/vue3';
import { reactive, ref, onMounted, computed } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Button from '@/Components/ui/Button.vue';
import Input from '@/Components/ui/Input.vue';
import Label from '@/Components/ui/Label.vue';
import Dialog from '@/Components/ui/Dialog.vue';
import DialogHeader from '@/Components/ui/DialogHeader.vue';
import DialogTitle from '@/Components/ui/DialogTitle.vue';
import DialogFooter from '@/Components/ui/DialogFooter.vue';
import DialogDescription from '@/Components/ui/DialogDescription.vue';
import api from '@/lib/api';

const loading = ref(false);
const applications = ref([]);
const pagination = ref(null);
const detailOpen = ref(false);
const selectedApplication = ref(null);
const updatingId = ref(null);

const filters = reactive({
    search: '',
    status: 'pending',
    page: 1,
    limit: 10,
});

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

const hasApplications = computed(() => !loading.value && applications.value.length > 0);

const fetchApplications = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/teacher-applications', {
            params: { ...filters },
        });
        applications.value = data.applications;
        pagination.value = data.pagination;
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        alert('Failed to load teacher applications.');
    } finally {
        loading.value = false;
    }
};

const goToPage = (page) => {
    if (!pagination.value) return;
    if (page < 1 || page > pagination.value.totalPages) return;
    filters.page = page;
    fetchApplications();
};

const resetFilters = () => {
    filters.search = '';
    filters.status = 'pending';
    filters.page = 1;
    fetchApplications();
};

const openDetails = (application) => {
    selectedApplication.value = application;
    detailOpen.value = true;
};

const currentStatusLabel = (application) => {
    const status = application.meta?.teacher_application_status;
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    return application.accepted ? 'Approved' : 'Pending';
};

const formatDateTime = (value) => {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleString();
    } catch {
        return value;
    }
};

const updateStatus = async (application, status, notes = '') => {
    if (updatingId.value) return;
    updatingId.value = application.id;
    try {
        await api.patch(`/teacher-applications/${application.id}`, { status, notes });
        alert(`Application ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}.`);
        await fetchApplications();
        detailOpen.value = false;
    } catch (error) {
        console.error('Failed to update status:', error);
        const message = error.response?.data?.message || 'Failed to update application status.';
        alert(message);
    } finally {
        updatingId.value = null;
    }
};

const approveApplication = (application) => {
    if (!confirm(`Approve ${application.name}'s application?`)) {
        return;
    }
    updateStatus(application, 'approved');
};

const rejectApplication = (application) => {
    const notes = prompt(`Optional: add notes for rejecting ${application.name}. Leave blank to skip.`);
    if (notes === null) {
        return;
    }
    if (!confirm(`Reject ${application.name}'s application?`)) {
        return;
    }
    updateStatus(application, 'rejected', notes);
};

onMounted(fetchApplications);
</script>

<template>
    <Head title="Teacher Applications" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Teacher Applications
                    </h2>
                    <p class="text-sm text-gray-500">
                        Review, approve, or reject teacher applications submitted from the public apply page.
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <Button
                        variant="outline"
                        :disabled="loading"
                        @click="fetchApplications"
                    >
                        Refresh
                    </Button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        @submit.prevent="fetchApplications"
                    >
                        <div class="space-y-2">
                            <Label>Search</Label>
                            <Input
                                v-model="filters.search"
                                type="text"
                                placeholder="Name or email"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Status</Label>
                            <select
                                v-model="filters.status"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option
                                    v-for="option in statusOptions"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                        <div class="flex items-end gap-3 sm:col-span-2 lg:col-span-1">
                            <Button
                                type="submit"
                                class="flex-1"
                                :disabled="loading"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                class="flex-1"
                                :disabled="loading"
                                @click="resetFilters"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th scope="col" class="px-6 py-3">Applicant</th>
                                    <th scope="col" class="px-6 py-3">Profile</th>
                                    <th scope="col" class="px-6 py-3">Submitted</th>
                                    <th scope="col" class="px-6 py-3">Status</th>
                                    <th scope="col" class="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!loading && !hasApplications">
                                    <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                                        No applications found for the selected filters.
                                    </td>
                                </tr>
                                <tr
                                    v-for="application in applications"
                                    :key="application.id"
                                    class="text-sm text-gray-700"
                                >
                                    <td class="px-6 py-4 align-top">
                                        <div class="font-medium text-gray-900">{{ application.name }}</div>
                                        <div class="text-gray-500">{{ application.email }}</div>
                                        <div class="text-xs text-gray-400">
                                            {{ application.country ?? '—' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 align-top">
                                        <div class="space-y-1">
                                            <div>
                                                <span class="font-medium">Degree:</span>
                                                {{ application.teacher_profile?.degree ?? '—' }}
                                            </div>
                                            <div>
                                                <span class="font-medium">Major:</span>
                                                {{ application.teacher_profile?.major ?? '—' }}
                                            </div>
                                            <div>
                                                <span class="font-medium">English Level:</span>
                                                {{ application.teacher_profile?.english_level ?? '—' }}
                                            </div>
                                            <div>
                                                <span class="font-medium">Availability:</span>
                                                {{ application.teacher_profile?.availability ?? '—' }}
                                            </div>
                                            <div class="space-x-2 text-xs">
                                                <a
                                                    v-if="application.teacher_profile?.resume_url"
                                                    :href="application.teacher_profile.resume_url"
                                                    target="_blank"
                                                    rel="noopener"
                                                    class="text-blue-600 hover:underline"
                                                >
                                                    Resume
                                                </a>
                                                <a
                                                    v-if="application.teacher_profile?.intro_video_url"
                                                    :href="application.teacher_profile.intro_video_url"
                                                    target="_blank"
                                                    rel="noopener"
                                                    class="text-blue-600 hover:underline"
                                                >
                                                    Intro Video
                                                </a>
                                                <a
                                                    v-if="application.teacher_profile?.speed_test_screenshot_url"
                                                    :href="application.teacher_profile.speed_test_screenshot_url"
                                                    target="_blank"
                                                    rel="noopener"
                                                    class="text-blue-600 hover:underline"
                                                >
                                                    Speed Test
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 align-top">
                                        {{ formatDateTime(application.created_at) }}
                                    </td>
                                    <td class="px-6 py-4 align-top">
                                        <span
                                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                                            :class="currentStatusLabel(application) === 'Approved'
                                                ? 'bg-green-100 text-green-700'
                                                : currentStatusLabel(application) === 'Rejected'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'"
                                        >
                                            {{ currentStatusLabel(application) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 align-top">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                @click="openDetails(application)"
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                :disabled="updatingId === application.id || currentStatusLabel(application) === 'Approved'"
                                                @click="approveApplication(application)"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                :disabled="updatingId === application.id || currentStatusLabel(application) === 'Rejected'"
                                                @click="rejectApplication(application)"
                                            >
                                                Reject
                                            </Button>
                                        </div>
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
                            Page {{ pagination.page }} of {{ pagination.totalPages ?? 1 }}
                        </div>
                        <div class="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                :disabled="loading || pagination.page === 1"
                                @click="goToPage(pagination.page - 1)"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                :disabled="loading || pagination.page === pagination.totalPages"
                                @click="goToPage(pagination.page + 1)"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Dialog :open="detailOpen" @update:open="detailOpen = $event">
            <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription v-if="selectedApplication">
                    Submitted {{ formatDateTime(selectedApplication.created_at) }}
                </DialogDescription>
            </DialogHeader>

            <div v-if="selectedApplication" class="space-y-4 overflow-y-auto pr-2">
                <section class="space-y-1">
                    <h3 class="text-sm font-semibold text-gray-700">Applicant</h3>
                    <p class="text-sm text-gray-600">
                        {{ selectedApplication.name }} &middot; {{ selectedApplication.email }}
                    </p>
                    <p class="text-xs text-gray-500">
                        Country: {{ selectedApplication.country ?? '—' }} |
                        Timezone: {{ selectedApplication.timezone ?? '—' }}
                    </p>
                </section>

            <section class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-700">Profile</h3>
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                        <span class="text-xs uppercase text-gray-500">Degree</span>
                        <div class="text-sm text-gray-700">
                            {{ selectedApplication.teacher_profile?.degree ?? '—' }}
                        </div>
                    </div>
                    <div>
                        <span class="text-xs uppercase text-gray-500">Major</span>
                        <div class="text-sm text-gray-700">
                            {{ selectedApplication.teacher_profile?.major ?? '—' }}
                        </div>
                    </div>
                    <div>
                        <span class="text-xs uppercase text-gray-500">English Level</span>
                        <div class="text-sm text-gray-700">
                            {{ selectedApplication.teacher_profile?.english_level ?? '—' }}
                        </div>
                    </div>
                    <div>
                        <span class="text-xs uppercase text-gray-500">Availability</span>
                        <div class="text-sm text-gray-700">
                            {{ selectedApplication.teacher_profile?.availability ?? '—' }}
                        </div>
                    </div>
                </div>
                <div>
                    <span class="text-xs uppercase text-gray-500">Experience</span>
                    <p class="mt-1 whitespace-pre-line text-sm text-gray-700">
                        {{ selectedApplication.teacher_profile?.experience ?? '—' }}
                    </p>
                </div>
                <div>
                    <span class="text-xs uppercase text-gray-500">Motivation</span>
                    <p class="mt-1 whitespace-pre-line text-sm text-gray-700">
                        {{ selectedApplication.teacher_profile?.motivation ?? '—' }}
                    </p>
                </div>
            </section>

            <section class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-700">Equipment</h3>
                <ul class="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
                    <li>Webcam: <span class="font-medium">{{ selectedApplication.teacher_profile?.has_webcam ? 'Yes' : 'No' }}</span></li>
                    <li>Headset: <span class="font-medium">{{ selectedApplication.teacher_profile?.has_headset ? 'Yes' : 'No' }}</span></li>
                    <li>Backup Internet: <span class="font-medium">{{ selectedApplication.teacher_profile?.has_backup_internet ? 'Yes' : 'No' }}</span></li>
                    <li>Backup Power: <span class="font-medium">{{ selectedApplication.teacher_profile?.has_backup_power ? 'Yes' : 'No' }}</span></li>
                </ul>
            </section>

            <section class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-700">Attachments</h3>
                <div class="flex flex-wrap gap-3 text-sm">
                    <a
                        v-if="selectedApplication.teacher_profile?.resume_url"
                        :href="selectedApplication.teacher_profile.resume_url"
                        target="_blank"
                        rel="noopener"
                        class="text-blue-600 hover:underline"
                    >
                        Resume
                    </a>
                    <a
                        v-if="selectedApplication.teacher_profile?.intro_video_url"
                        :href="selectedApplication.teacher_profile.intro_video_url"
                        target="_blank"
                        rel="noopener"
                        class="text-blue-600 hover:underline"
                    >
                        Intro Video
                    </a>
                    <a
                        v-if="selectedApplication.teacher_profile?.speed_test_screenshot_url"
                        :href="selectedApplication.teacher_profile.speed_test_screenshot_url"
                        target="_blank"
                        rel="noopener"
                        class="text-blue-600 hover:underline"
                    >
                        Speed Test
                    </a>
                </div>
            </section>

            <section v-if="selectedApplication.meta?.teacher_application_notes" class="space-y-1">
                <h3 class="text-sm font-semibold text-gray-700">Reviewer Notes</h3>
                <p class="whitespace-pre-line text-sm text-gray-700">
                    {{ selectedApplication.meta.teacher_application_notes }}
                </p>
            </section>
            </div>

            <DialogFooter class="flex items-center justify-between gap-2">
                <div class="text-xs text-gray-500">
                    Status: {{ currentStatusLabel(selectedApplication ?? {}) }}
                </div>
                <div class="flex items-center gap-2">
                    <Button
                        variant="outline"
                        @click="detailOpen = false"
                    >
                        Close
                    </Button>
                    <Button
                        :disabled="!selectedApplication || updatingId === selectedApplication.id"
                        @click="approveApplication(selectedApplication)"
                    >
                        Approve
                    </Button>
                    <Button
                        variant="destructive"
                        :disabled="!selectedApplication || updatingId === selectedApplication.id"
                        @click="rejectApplication(selectedApplication)"
                    >
                        Reject
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    </AuthenticatedLayout>
</template>

