<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import Dialog from '@/Components/ui/Dialog.vue';
import DialogHeader from '@/Components/ui/DialogHeader.vue';
import DialogTitle from '@/Components/ui/DialogTitle.vue';
import DialogDescription from '@/Components/ui/DialogDescription.vue';
import DialogFooter from '@/Components/ui/DialogFooter.vue';
import {
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    BookOpenIcon,
    BanknotesIcon,
    GlobeAltIcon,
    ClockIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
    userId: {
        type: [String, Number],
        required: true,
    },
});

const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const isSuperAdmin = computed(() => role.value === 'super-admin');
const canEdit = computed(() => ['admin', 'super-admin'].includes(role.value));
const canDelete = computed(() => isSuperAdmin.value);

const loading = ref(false);
const teacher = ref(null);
const editDialogOpen = ref(false);
const deleteDialogOpen = ref(false);

const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatTime = (time) => {
    if (!time) return '—';
    return time;
};

const fetchTeacher = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/teacher/${props.userId}`);
        teacher.value = data;
    } catch (error) {
        console.error('Error fetching teacher:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    try {
        loading.value = true;
        await api.delete(`/teacher/${props.userId}`);
        router.visit(route('teachers.index'));
    } catch (error) {
        console.error('Error deleting teacher:', error);
        deleteDialogOpen.value = false;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchTeacher);
</script>

<template>
    <Head :title="teacher ? `${teacher.name} - Teacher Details` : 'Teacher Details'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button
                        @click="router.visit(route('teachers.index'))"
                        class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">
                            {{ teacher?.name ?? 'Loading...' }}
                        </h2>
                        <p class="text-sm text-gray-500">
                            {{ teacher?.role === 'teacher' ? 'Teacher' : 'Admin' }}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3" v-if="canEdit || canDelete">
                    <Button
                        v-if="canDelete"
                        @click="deleteDialogOpen = true"
                        variant="destructive"
                        :disabled="loading"
                    >
                        <TrashIcon class="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !teacher" class="text-center py-12">
                    <div class="text-gray-500">Loading teacher information...</div>
                </div>

                <template v-else-if="teacher">
                    <!-- Teacher Information Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900">Teacher Information</h3>
                        </div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Name</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.name ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                                    <dd class="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <EnvelopeIcon class="h-4 w-4 text-gray-400" />
                                        {{ teacher.email ?? '—' }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Country</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.country ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        <span
                                            :class="{
                                                'bg-green-100 text-green-800': teacher.status === 'active',
                                                'bg-yellow-100 text-yellow-800': teacher.status === 'pending',
                                                'bg-red-100 text-red-800': teacher.status === 'inactive',
                                            }"
                                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                        >
                                            {{ teacher.status ?? '—' }}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Accepted</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        <span
                                            :class="{
                                                'bg-green-100 text-green-800': teacher.accepted,
                                                'bg-gray-100 text-gray-800': !teacher.accepted,
                                            }"
                                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                        >
                                            {{ teacher.accepted ? 'Yes' : 'No' }}
                                        </span>
                                    </dd>
                                </div>
                                <div v-if="teacher.teacher_profile">
                                    <dt class="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.teacher_profile.phone ?? '—' }}</dd>
                                </div>
                                <div v-if="teacher.teacher_profile">
                                    <dt class="text-sm font-medium text-gray-500">Degree</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.teacher_profile.degree ?? '—' }}</dd>
                                </div>
                                <div v-if="teacher.teacher_profile">
                                    <dt class="text-sm font-medium text-gray-500">Major</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.teacher_profile.major ?? '—' }}</dd>
                                </div>
                                <div v-if="teacher.teacher_profile">
                                    <dt class="text-sm font-medium text-gray-500">English Level</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.teacher_profile.english_level ?? '—' }}</dd>
                                </div>
                                <div v-if="teacher.teacher_profile?.assigned_admin">
                                    <dt class="text-sm font-medium text-gray-500">Assigned Admin</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ teacher.teacher_profile.assigned_admin.name ?? '—' }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- Classes Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <CalendarIcon class="h-5 w-5" />
                                Classes ({{ teacher.classes_teaching?.length ?? 0 }})
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <div v-if="!teacher.classes_teaching || teacher.classes_teaching.length === 0" class="text-center py-8 text-gray-500">
                                No classes assigned
                            </div>
                            <div v-else class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Type
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Student
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Start Date
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Time
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Book
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr
                                            v-for="classItem in teacher.classes_teaching"
                                            :key="classItem.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('classes.show', classItem.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ classItem.type ?? '—' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ classItem.student?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(classItem.start_date) }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                <span v-if="classItem.start_time && classItem.end_time">
                                                    {{ formatTime(classItem.start_time) }} - {{ formatTime(classItem.end_time) }}
                                                </span>
                                                <span v-else>—</span>
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ classItem.book?.title ?? '—' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Book Assignments Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BookOpenIcon class="h-5 w-5" />
                                Book Assignments ({{ teacher.book_assignments?.length ?? 0 }})
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <div v-if="!teacher.book_assignments || teacher.book_assignments.length === 0" class="text-center py-8 text-gray-500">
                                No book assignments
                            </div>
                            <div v-else class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Book
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Student
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Assigned Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr
                                            v-for="assignment in teacher.book_assignments"
                                            :key="assignment.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('assignments.show', assignment.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.book?.title ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.student?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(assignment.created_at) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Payouts Card (if super-admin or admin) -->
                    <div v-if="isSuperAdmin || role === 'admin'" class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BanknotesIcon class="h-5 w-5" />
                                Payouts ({{ teacher.payouts?.length ?? 0 }})
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <div v-if="!teacher.payouts || teacher.payouts.length === 0" class="text-center py-8 text-gray-500">
                                No payouts
                            </div>
                            <div v-else class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Period
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Duration
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Classes
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Amount
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr
                                            v-for="payout in teacher.payouts"
                                            :key="payout.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('payouts.show', payout.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(payout.start_date) }} - {{ formatDate(payout.end_date) }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ payout.duration ?? '—' }} hrs</td>
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ payout.total_class ?? '—' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                ₱{{ Number(payout.amount ?? 0).toFixed(2) }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                <span
                                                    :class="{
                                                        'bg-yellow-100 text-yellow-800': payout.status === 'pending',
                                                        'bg-blue-100 text-blue-800': payout.status === 'processing',
                                                        'bg-green-100 text-green-800': payout.status === 'completed',
                                                    }"
                                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                >
                                                    {{ payout.status ?? '—' }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
            <div>
                <DialogHeader>
                    <DialogTitle>Delete Teacher</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{{ teacher?.name }}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="handleDelete" :disabled="loading">
                        Delete
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    </AuthenticatedLayout>
</template>

