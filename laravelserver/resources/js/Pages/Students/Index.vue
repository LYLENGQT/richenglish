<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
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
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

const page = usePage();
const isSuperAdmin = computed(() => page.props.auth?.user?.role === 'super-admin');

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);

const filters = reactive({
    name: '',
    nationality: '',
    manager_type: '',
    category_level: '',
    class_type: '',
    platform: '',
    page: 1,
    limit: 10,
});

const nationalities = ['KOREAN', 'CHINESE'];
const platforms = ['Zoom', 'Voov'];

const fetchStudents = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/students', { params: filters });
        rows.value = data.students;
        pagination.value = data.pagination ?? { total: data.total ?? data.students.length, page: 1, totalPages: 1 };
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const goToPage = (page) => {
    if (!pagination.value) return;
    if (page < 1 || page > pagination.value.totalPages) return;
    filters.page = page;
    fetchStudents();
};

const resetFilters = () => {
    filters.name = '';
    filters.nationality = '';
    filters.manager_type = '';
    filters.category_level = '';
    filters.class_type = '';
    filters.platform = '';
    filters.page = 1;
    fetchStudents();
};

const dialogOpen = ref(false);
const editingStudent = ref(null);
const submitting = ref(false);
const formData = reactive({
    name: '',
    age: '',
    nationality: '',
    manager_type: '',
    email: '',
    category_level: '',
    class_type: '',
    platform: 'Zoom',
    platform_link: '',
    preferred_book: '',
    student_identification: '',
});

const openAddDialog = () => {
    editingStudent.value = null;
    Object.assign(formData, {
        name: '',
        age: '',
        nationality: '',
        manager_type: '',
        email: '',
        category_level: '',
        class_type: '',
        platform: 'Zoom',
        platform_link: '',
        preferred_book: '',
        student_identification: '',
    });
    dialogOpen.value = true;
};

const openEditDialog = (student) => {
    editingStudent.value = student;
    Object.assign(formData, {
        name: student.name || '',
        age: student.age || '',
        nationality: student.nationality || '',
        manager_type: student.manager_type || '',
        email: student.email || '',
        category_level: student.category_level || '',
        class_type: student.class_type || '',
        platform: student.platform || 'Zoom',
        platform_link: student.platform_link || '',
        preferred_book: student.preferred_book || '',
        student_identification: student.student_identification || '',
    });
    dialogOpen.value = true;
};

const handleSubmit = async () => {
    submitting.value = true;
    try {
        const payload = { ...formData };
        // Don't send student_identification when editing (it's read-only)
        if (editingStudent.value) {
            delete payload.student_identification;
        } else if (!payload.student_identification) {
            // When adding, remove empty student_identification so it auto-generates
            delete payload.student_identification;
        }
        if (editingStudent.value) {
            await api.patch(`/students/${editingStudent.value.id}`, payload);
        } else {
            await api.post('/students', payload);
        }
        dialogOpen.value = false;
        await fetchStudents();
    } catch (error) {
        console.error('Error saving student:', error);
        alert(error.response?.data?.message || 'Failed to save student');
    } finally {
        submitting.value = false;
    }
};

const handleDelete = async (student) => {
    if (!confirm(`Delete ${student.name}?`)) return;
    try {
        loading.value = true;
        await api.delete(`/students/${student.id}`);
        await fetchStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchStudents);
</script>

<template>
    <Head title="Students" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Students
                    </h2>
                    <p class="text-sm text-gray-500">
                        Manage enrolled learners, filter by profile, and update information.
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <Button
                        v-if="isSuperAdmin"
                        @click="openAddDialog"
                        :disabled="loading"
                    >
                        Add Student
                    </Button>
                    <button
                        @click="fetchStudents"
                        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        :disabled="loading"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                v-model="filters.name"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Search name"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Nationality
                            </label>
                            <select
                                v-model="filters.nationality"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Any</option>
                                <option
                                    v-for="option in nationalities"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Manager Type
                            </label>
                            <input
                                v-model="filters.manager_type"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="KM / CM"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Category Level
                            </label>
                            <input
                                v-model="filters.category_level"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Beginner, Adult..."
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Class Type
                            </label>
                            <input
                                v-model="filters.class_type"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Zoom, Voov..."
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Platform
                            </label>
                            <select
                                v-model="filters.platform"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Any</option>
                                <option
                                    v-for="platform in platforms"
                                    :key="platform"
                                    :value="platform"
                                >
                                    {{ platform }}
                                </option>
                            </select>
                        </div>
                        <div class="flex items-end gap-3">
                            <button
                                type="button"
                                @click="fetchStudents"
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

                <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th scope="col" class="px-6 py-3">
                                        Student
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Nationality
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Category Level
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Class Type
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Platform
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Preferred Book
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Updated
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!loading && rows.length === 0">
                                    <td
                                        colspan="8"
                                        class="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No students found.
                                    </td>
                                </tr>
                                <tr
                                    v-for="student in rows"
                                    :key="student.id"
                                    class="text-sm text-gray-700"
                                >
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">
                                            {{ student.name }}
                                        </div>
                                        <div class="text-gray-500">
                                            {{ student.email ?? '—' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ student.nationality ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ student.category_level ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ student.class_type ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ student.platform ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ student.preferred_book ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{
                                            student.updated_at
                                                ? new Date(student.updated_at).toLocaleDateString()
                                                : '—'
                                        }}
                                    </td>
                                    <td v-if="isSuperAdmin" class="px-6 py-4">
                                        <div class="flex items-center gap-2">
                                            <Button
                                                @click="router.visit(route('students.show', student.id))"
                                                variant="outline"
                                                size="sm"
                                            >
                                                View
                                            </Button>
                                            <Button
                                                @click="openEditDialog(student)"
                                                variant="outline"
                                                size="sm"
                                            >
                                                <PencilIcon class="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                @click="handleDelete(student)"
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <TrashIcon class="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                    <td v-else class="px-6 py-4">
                                        <Button
                                            @click="router.visit(route('students.show', student.id))"
                                            variant="outline"
                                            size="sm"
                                        >
                                            View
                                        </Button>
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
        </div>

        <!-- Add/Edit Dialog -->
        <Dialog :open="dialogOpen" @update:open="dialogOpen = $event">
            <div class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {{ editingStudent ? 'Update Student' : 'Add Student' }}
                    </DialogTitle>
                    <DialogDescription>
                        {{ editingStudent ? 'Update student information' : 'Add a new student to the system' }}
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label>
                                Name <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                v-model="formData.name"
                                type="text"
                                required
                                placeholder="Student name"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Age</Label>
                            <Input
                                v-model="formData.age"
                                type="number"
                                placeholder="Age"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Email</Label>
                            <Input
                                v-model="formData.email"
                                type="email"
                                placeholder="student@example.com"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Nationality</Label>
                            <select
                                v-model="formData.nationality"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">Select nationality</option>
                                <option value="KOREAN">KOREAN</option>
                                <option value="CHINESE">CHINESE</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <Label>Manager Type</Label>
                            <Input
                                v-model="formData.manager_type"
                                type="text"
                                placeholder="KM / CM"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Category Level</Label>
                            <Input
                                v-model="formData.category_level"
                                type="text"
                                placeholder="Beginner, Adult..."
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Class Type</Label>
                            <Input
                                v-model="formData.class_type"
                                type="text"
                                placeholder="Class type"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Platform</Label>
                            <select
                                v-model="formData.platform"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="Zoom">Zoom</option>
                                <option value="Voov">Voov</option>
                            </select>
                        </div>
                        <div class="space-y-2 sm:col-span-2">
                            <Label>Platform Link</Label>
                            <Input
                                v-model="formData.platform_link"
                                type="url"
                                placeholder="https://..."
                            />
                        </div>
                        <div class="space-y-2 sm:col-span-2">
                            <Label>Preferred Book</Label>
                            <Input
                                v-model="formData.preferred_book"
                                type="text"
                                placeholder="Preferred book"
                            />
                        </div>
                        <div class="space-y-2 sm:col-span-2">
                            <Label>
                                Student ID
                                <span v-if="!editingStudent" class="text-xs text-muted-foreground">
                                    (Auto-generated if empty)
                                </span>
                                <span v-else class="text-xs text-muted-foreground">
                                    (Cannot be changed)
                                </span>
                            </Label>
                            <Input
                                v-model="formData.student_identification"
                                type="text"
                                :disabled="!!editingStudent"
                                :placeholder="!editingStudent ? 'Auto-generated if empty' : ''"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            @click="dialogOpen = false"
                            :disabled="submitting"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            :disabled="submitting"
                        >
                            {{ submitting ? (editingStudent ? 'Updating...' : 'Adding...') : (editingStudent ? 'Update' : 'Add') }}
                        </Button>
                    </DialogFooter>
                </form>
            </div>
        </Dialog>
    </AuthenticatedLayout>
</template>

