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
import Input from '@/Components/ui/Input.vue';
import Label from '@/Components/ui/Label.vue';
import {
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
    studentId: {
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
const student = ref(null);
const editDialogOpen = ref(false);
const deleteDialogOpen = ref(false);

const editForm = ref({
    name: '',
    age: '',
    nationality: '',
    manager_type: '',
    email: '',
    category_level: '',
    class_type: '',
    platform: '',
    platform_link: '',
    preferred_book: '',
});

const fetchStudent = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/students/${props.studentId}`);
        student.value = data;
        // Populate edit form
        editForm.value = {
            name: data.name ?? '',
            age: data.age ?? '',
            nationality: data.nationality ?? '',
            manager_type: data.manager_type ?? '',
            email: data.email ?? '',
            category_level: data.category_level ?? '',
            class_type: data.class_type ?? '',
            platform: data.platform ?? '',
            platform_link: data.platform_link ?? '',
            preferred_book: data.preferred_book ?? '',
        };
    } catch (error) {
        console.error('Error fetching student:', error);
    } finally {
        loading.value = false;
    }
};

const handleEdit = () => {
    editDialogOpen.value = true;
};

const handleUpdate = async () => {
    try {
        loading.value = true;
        await api.patch(`/students/${props.studentId}`, editForm.value);
        editDialogOpen.value = false;
        await fetchStudent();
    } catch (error) {
        console.error('Error updating student:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    try {
        loading.value = true;
        await api.delete(`/students/${props.studentId}`);
        router.visit(route('students.index'));
    } catch (error) {
        console.error('Error deleting student:', error);
        deleteDialogOpen.value = false;
    } finally {
        loading.value = false;
    }
};

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

onMounted(fetchStudent);
</script>

<template>
    <Head :title="student ? `${student.name} - Student Details` : 'Student Details'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button
                        @click="router.visit(route('students.index'))"
                        class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">
                            {{ student?.name ?? 'Loading...' }}
                        </h2>
                        <p class="text-sm text-gray-500">
                            Student ID: {{ student?.student_identification ?? '—' }}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3" v-if="canEdit || canDelete">
                    <Button
                        v-if="canEdit"
                        @click="handleEdit"
                        variant="outline"
                        :disabled="loading"
                    >
                        <PencilIcon class="h-4 w-4 mr-2" />
                        Edit
                    </Button>
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
                <div v-if="loading && !student" class="text-center py-12">
                    <div class="text-gray-500">Loading student information...</div>
                </div>

                <template v-else-if="student">
                    <!-- Student Information Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900">Student Information</h3>
                        </div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Name</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.name ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Student ID</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.student_identification ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Age</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.age ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Nationality</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        <span
                                            v-if="student.nationality"
                                            class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                        >
                                            {{ student.nationality }}
                                        </span>
                                        <span v-else>—</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Manager Type</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.manager_type ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                                    <dd class="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <EnvelopeIcon v-if="student.email" class="h-4 w-4 text-gray-400" />
                                        {{ student.email ?? '—' }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Category Level</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.category_level ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Class Type</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.class_type ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Platform</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        <span
                                            v-if="student.platform"
                                            class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                                        >
                                            {{ student.platform }}
                                        </span>
                                        <span v-else>—</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Platform Link</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        <a
                                            v-if="student.platform_link"
                                            :href="student.platform_link"
                                            target="_blank"
                                            class="text-blue-600 hover:text-blue-800"
                                        >
                                            {{ student.platform_link }}
                                        </a>
                                        <span v-else>—</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Preferred Book</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ student.preferred_book ?? '—' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Created</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(student.created_at) }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(student.updated_at) }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- Classes Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CalendarIcon class="h-5 w-5" />
                                    Classes ({{ student.classes?.length ?? 0 }})
                                </h3>
                            </div>
                        </div>
                        <div class="px-6 py-4">
                            <div v-if="!student.classes || student.classes.length === 0" class="text-center py-8 text-gray-500">
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
                                                Teacher
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Start Date
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                End Date
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
                                            v-for="classItem in student.classes"
                                            :key="classItem.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('classes.show', classItem.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">{{ classItem.type ?? '—' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ classItem.teacher?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(classItem.start_date) }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(classItem.end_date) }}
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

                    <!-- Attendance Card -->
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <ClipboardDocumentListIcon class="h-5 w-5" />
                                Attendance Records ({{ student.attendances?.length ?? 0 }})
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <div v-if="!student.attendances || student.attendances.length === 0" class="text-center py-8 text-gray-500">
                                No attendance records
                            </div>
                            <div v-else class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Date
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Teacher
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Duration
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Minutes Attended
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Notes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr
                                            v-for="attendance in student.attendances"
                                            :key="attendance.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('attendance.show', attendance.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ formatDate(attendance.date) }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ attendance.teacher?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ attendance.duration ?? '—' }} min
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ attendance.minutes_attended ?? '—' }} min
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-500">
                                                {{ attendance.notes ?? '—' }}
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
                                Assigned Books ({{ student.book_assignments?.length ?? 0 }})
                            </h3>
                        </div>
                        <div class="px-6 py-4">
                            <div v-if="!student.book_assignments || student.book_assignments.length === 0" class="text-center py-8 text-gray-500">
                                No books assigned
                            </div>
                            <div v-else class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Book
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Teacher
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Assigned By
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Assigned Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr
                                            v-for="assignment in student.book_assignments"
                                            :key="assignment.id"
                                            class="hover:bg-gray-50 cursor-pointer"
                                            @click="router.visit(route('assignments.show', assignment.id))"
                                        >
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.book?.title ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.teacher?.name ?? '—' }}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-900">
                                                {{ assignment.assigned_by?.name ?? '—' }}
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
                </template>
            </div>
        </div>

        <!-- Edit Dialog -->
        <Dialog :open="editDialogOpen" @update:open="editDialogOpen = $event">
            <div class="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>
                        Update student information. All fields are optional except name.
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="name">Name *</Label>
                            <Input id="name" v-model="editForm.name" required />
                        </div>
                        <div>
                            <Label for="age">Age</Label>
                            <Input id="age" v-model="editForm.age" type="number" min="0" max="150" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="nationality">Nationality</Label>
                            <select
                                id="nationality"
                                v-model="editForm.nationality"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select...</option>
                                <option value="KOREAN">KOREAN</option>
                                <option value="CHINESE">CHINESE</option>
                            </select>
                        </div>
                        <div>
                            <Label for="manager_type">Manager Type</Label>
                            <Input id="manager_type" v-model="editForm.manager_type" placeholder="KM / CM" />
                        </div>
                    </div>
                    <div>
                        <Label for="email">Email</Label>
                        <Input id="email" v-model="editForm.email" type="email" />
                    </div>
                    <div>
                        <Label for="category_level">Category Level</Label>
                        <Input id="category_level" v-model="editForm.category_level" placeholder="Beginner, Adult..." />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="class_type">Class Type</Label>
                            <Input id="class_type" v-model="editForm.class_type" placeholder="Zoom, Voov..." />
                        </div>
                        <div>
                            <Label for="platform">Platform</Label>
                            <select
                                id="platform"
                                v-model="editForm.platform"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select...</option>
                                <option value="Zoom">Zoom</option>
                                <option value="Voov">Voov</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label for="platform_link">Platform Link</Label>
                        <Input id="platform_link" v-model="editForm.platform_link" type="url" />
                    </div>
                    <div>
                        <Label for="preferred_book">Preferred Book</Label>
                        <Input id="preferred_book" v-model="editForm.preferred_book" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="editDialogOpen = false">Cancel</Button>
                    <Button @click="handleUpdate" :disabled="loading">Save Changes</Button>
                </DialogFooter>
            </div>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
            <div>
                <DialogHeader>
                    <DialogTitle>Delete Student</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{{ student?.name }}</strong>? This action cannot be undone.
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

