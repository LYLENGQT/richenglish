<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Dialog from '@/Components/ui/Dialog.vue';
import DialogHeader from '@/Components/ui/DialogHeader.vue';
import DialogFooter from '@/Components/ui/DialogFooter.vue';
import DialogTitle from '@/Components/ui/DialogTitle.vue';
import Button from '@/Components/ui/Button.vue';
import Input from '@/Components/ui/Input.vue';
import Label from '@/Components/ui/Label.vue';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline';
import api from '@/lib/api';

const page = usePage();
const filterRole = computed(() => page.props.filterRole ?? null);
const isAdminsPage = computed(() => filterRole.value === 'admin');
const isSuperAdmin = computed(() => page.props.auth?.user?.role === 'super-admin');

const loading = ref(false);
const rows = ref([]);
const pagination = ref(null);
const dialogOpen = ref(false);
const editingUser = ref(null);
const submitting = ref(false);

const formData = reactive({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    country: '',
    timezone: 'Asia/Manila',
    role: filterRole.value || 'teacher',
    accepted: isAdminsPage.value ? true : false,
    // Teacher profile fields (optional)
    phone: '',
    degree: '',
    major: '',
    english_level: '',
    availability: '',
    has_webcam: false,
    has_headset: false,
    has_backup_internet: false,
});

const filters = reactive({
    search: '',
    country: '',
    degree: '',
    major: '',
    accepted: '',
    role: filterRole.value, // Add role filter
    page: 1,
    limit: 10,
});

const fetchTeachers = async () => {
    loading.value = true;
    try {
        const params = { ...filters };
        // Only include role if we're filtering for admins
        if (!isAdminsPage.value) {
            delete params.role;
        }
        const { data } = await api.get('/teacher', { params });
        rows.value = data.teachers;
        pagination.value = data.pagination;
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
    fetchTeachers();
};

const resetFilters = () => {
    filters.search = '';
    filters.country = '';
    filters.degree = '';
    filters.major = '';
    filters.accepted = '';
    filters.page = 1;
    if (isAdminsPage.value) {
        filters.role = 'admin';
    } else {
        delete filters.role;
    }
    fetchTeachers();
};

const openAddDialog = () => {
    editingUser.value = null;
    Object.assign(formData, {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        country: '',
        timezone: 'Asia/Manila',
        role: filterRole.value || 'teacher',
        accepted: isAdminsPage.value ? true : false,
        phone: '',
        degree: '',
        major: '',
        english_level: '',
        availability: '',
        has_webcam: false,
        has_headset: false,
        has_backup_internet: false,
    });
    dialogOpen.value = true;
};

const openEditDialog = (user) => {
    editingUser.value = user;
    const nameParts = user.name.split(' ');
    Object.assign(formData, {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        country: user.country || '',
        timezone: user.timezone || 'Asia/Manila',
        role: user.role,
        accepted: user.accepted ?? false,
        phone: user.teacher_profile?.phone || '',
        degree: user.teacher_profile?.degree || '',
        major: user.teacher_profile?.major || '',
        english_level: user.teacher_profile?.english_level || '',
        availability: user.teacher_profile?.availability || '',
        has_webcam: user.teacher_profile?.has_webcam || false,
        has_headset: user.teacher_profile?.has_headset || false,
        has_backup_internet: user.teacher_profile?.has_backup_internet || false,
    });
    dialogOpen.value = true;
};

const handleDelete = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        return;
    }

    try {
        await api.delete(`/teacher/${user.id}`);
        await fetchTeachers();
        alert(`${isAdminsPage.value ? 'Admin' : 'Teacher'} deleted successfully`);
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete. Please try again.');
    }
};

const handleSubmit = async () => {
    submitting.value = true;
    try {
        const payload = { ...formData };
        
        // Remove password if empty (for updates)
        if (editingUser.value && !payload.password) {
            delete payload.password;
        }

        if (editingUser.value) {
            // Update existing user
            await api.patch(`/teacher/${editingUser.value.id}`, payload);
            alert(`${isAdminsPage.value ? 'Admin' : 'Teacher'} updated successfully`);
        } else {
            // Create new user
            await api.post('/teacher', payload);
            alert(`${isAdminsPage.value ? 'Admin' : 'Teacher'} created successfully`);
        }

        dialogOpen.value = false;
        await fetchTeachers();
    } catch (error) {
        console.error('Submit error:', error);
        const message = error.response?.data?.message || error.message || 'Operation failed';
        alert(message);
    } finally {
        submitting.value = false;
    }
};

onMounted(fetchTeachers);
</script>

<template>
    <Head :title="isAdminsPage ? 'Admins' : 'Teachers'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        {{ isAdminsPage ? 'Admins' : 'Teachers' }}
                    </h2>
                    <p class="text-sm text-gray-500">
                        {{ isAdminsPage ? 'Manage admin accounts and permissions.' : 'Review teacher applications, availability, and equipment readiness.' }}
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        @click="openAddDialog"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <PlusIcon class="h-5 w-5" />
                        Add {{ isAdminsPage ? 'Admin' : 'Teacher' }}
                    </button>
                    <Button
                        @click="fetchTeachers"
                        variant="outline"
                        :disabled="loading"
                    >
                        Refresh
                    </Button>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Search
                            </label>
                            <input
                                v-model="filters.search"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Name or email"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <input
                                v-model="filters.country"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="PH"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Degree
                            </label>
                            <input
                                v-model="filters.degree"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="BA English"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Major
                            </label>
                            <input
                                v-model="filters.major"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Linguistics"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Accepted
                            </label>
                            <select
                                v-model="filters.accepted"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Any</option>
                                <option value="true">Accepted</option>
                                <option value="false">Pending</option>
                            </select>
                        </div>
                        <div class="flex items-end gap-3">
                            <button
                                type="button"
                                @click="fetchTeachers"
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
                                        {{ isAdminsPage ? 'Admin' : 'Teacher' }}
                                    </th>
                                    <th v-if="!isAdminsPage" scope="col" class="px-6 py-3">
                                        Profile
                                    </th>
                                    <th v-if="!isAdminsPage" scope="col" class="px-6 py-3">
                                        Equipment
                                    </th>
                                    <th v-if="!isAdminsPage" scope="col" class="px-6 py-3">
                                        Availability
                                    </th>
                                    <th v-if="!isAdminsPage" scope="col" class="px-6 py-3">
                                        Assigned Admin
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Status
                                    </th>
                                    <th v-if="isSuperAdmin" scope="col" class="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!loading && rows.length === 0">
                                    <td
                                        :colspan="isAdminsPage ? (isSuperAdmin ? 3 : 2) : (isSuperAdmin ? 7 : 6)"
                                        class="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No {{ isAdminsPage ? 'admins' : 'teachers' }} found.
                                    </td>
                                </tr>
                                <tr
                                    v-for="user in rows"
                                    :key="user.id"
                                    class="text-sm text-gray-700"
                                >
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">
                                            {{ user.name }}
                                        </div>
                                        <div class="text-gray-500">
                                            {{ user.email }}
                                        </div>
                                        <div class="text-xs text-gray-400">
                                            {{ user.country }}
                                        </div>
                                    </td>
                                    <td v-if="!isAdminsPage" class="px-6 py-4">
                                        <div>
                                            {{ user.teacher_profile?.degree ?? '—' }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            Major {{ user.teacher_profile?.major ?? '—' }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            English Level {{ user.teacher_profile?.english_level ?? '—' }}
                                        </div>
                                    </td>
                                    <td v-if="!isAdminsPage" class="px-6 py-4">
                                        <ul class="space-y-1 text-xs text-gray-600">
                                            <li>
                                                Webcam:
                                                <span class="font-medium">
                                                    {{ user.teacher_profile?.has_webcam ? 'Yes' : 'No' }}
                                                </span>
                                            </li>
                                            <li>
                                                Headset:
                                                <span class="font-medium">
                                                    {{ user.teacher_profile?.has_headset ? 'Yes' : 'No' }}
                                                </span>
                                            </li>
                                            <li>
                                                Backup Internet:
                                                <span class="font-medium">
                                                    {{ user.teacher_profile?.has_backup_internet ? 'Yes' : 'No' }}
                                                </span>
                                            </li>
                                        </ul>
                                    </td>
                                    <td v-if="!isAdminsPage" class="px-6 py-4">
                                        {{ user.teacher_profile?.availability ?? '—' }}
                                    </td>
                                    <td v-if="!isAdminsPage" class="px-6 py-4">
                                        {{
                                            user.teacher_profile?.assigned_admin?.name ?? 'Unassigned'
                                        }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                                            :class="user.accepted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                                        >
                                            {{ user.accepted ? 'Active' : 'Pending' }}
                                        </span>
                                    </td>
                                    <td v-if="isSuperAdmin" class="px-6 py-4">
                                        <div class="flex items-center gap-2">
                                            <Button
                                                @click="router.visit(route(isAdminsPage ? 'admins.show' : 'teachers.show', user.id))"
                                                variant="outline"
                                                size="sm"
                                                class="flex items-center gap-1"
                                                title="View"
                                            >
                                                View
                                            </Button>
                                            <Button
                                                @click="openEditDialog(user)"
                                                variant="outline"
                                                size="sm"
                                                class="flex items-center gap-1"
                                                title="Edit"
                                            >
                                                <PencilIcon class="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                @click="handleDelete(user)"
                                                variant="destructive"
                                                size="sm"
                                                class="flex items-center gap-1"
                                                title="Delete"
                                            >
                                                <TrashIcon class="h-4 w-4" />
                                                Delete
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
                            Page {{ pagination.page }} of
                            {{ pagination.totalPages ?? 1 }}
                        </div>
                        <div class="flex items-center gap-2">
                            <Button
                                @click="goToPage(pagination.page - 1)"
                                variant="outline"
                                size="sm"
                                :disabled="loading || pagination.page === 1"
                            >
                                Previous
                            </Button>
                            <Button
                                @click="goToPage(pagination.page + 1)"
                                variant="outline"
                                size="sm"
                                :disabled="loading || pagination.page === pagination.totalPages"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Dialog -->
        <Dialog :open="dialogOpen" @update:open="dialogOpen = $event">
            <DialogHeader>
                <DialogTitle>
                    {{ editingUser ? `Edit ${isAdminsPage ? 'Admin' : 'Teacher'}` : `Add ${isAdminsPage ? 'Admin' : 'Teacher'}` }}
                </DialogTitle>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div class="space-y-2">
                        <Label>
                            First Name <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            v-model="formData.first_name"
                            type="text"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>
                            Last Name <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            v-model="formData.last_name"
                            type="text"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>
                            Email <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            v-model="formData.email"
                            type="email"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>
                            Password <span class="text-destructive">*</span>
                            <span v-if="editingUser" class="text-xs text-muted-foreground">(leave blank to keep current)</span>
                        </Label>
                        <Input
                            v-model="formData.password"
                            type="password"
                            :required="!editingUser"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>Country</Label>
                        <Input
                            v-model="formData.country"
                            type="text"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>Timezone</Label>
                        <Input
                            v-model="formData.timezone"
                            type="text"
                        />
                    </div>
                    <div v-if="!editingUser" class="space-y-2">
                        <Label>
                            Role <span class="text-destructive">*</span>
                        </Label>
                        <select
                            v-model="formData.role"
                            required
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <Label>Status</Label>
                        <select
                            v-model="formData.accepted"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option :value="false">Pending</option>
                            <option :value="true">Accepted/Active</option>
                        </select>
                    </div>
                </div>

                <!-- Teacher-specific fields (only show for teachers) -->
                <template v-if="formData.role === 'teacher' || (!editingUser && !isAdminsPage)">
                    <div class="border-t pt-4">
                        <h4 class="text-sm font-medium mb-3">Teacher Profile (Optional)</h4>
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    v-model="formData.phone"
                                    type="text"
                                />
                            </div>
                            <div class="space-y-2">
                                <Label>Degree</Label>
                                <Input
                                    v-model="formData.degree"
                                    type="text"
                                />
                            </div>
                            <div class="space-y-2">
                                <Label>Major</Label>
                                <Input
                                    v-model="formData.major"
                                    type="text"
                                />
                            </div>
                            <div class="space-y-2">
                                <Label>English Level</Label>
                                <Input
                                    v-model="formData.english_level"
                                    type="text"
                                />
                            </div>
                            <div class="sm:col-span-2 space-y-2">
                                <Label>Availability</Label>
                                <Input
                                    v-model="formData.availability"
                                    type="text"
                                />
                            </div>
                            <div class="flex items-center gap-2">
                                <input
                                    v-model="formData.has_webcam"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                                />
                                <Label class="!mb-0">Has Webcam</Label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input
                                    v-model="formData.has_headset"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                                />
                                <Label class="!mb-0">Has Headset</Label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input
                                    v-model="formData.has_backup_internet"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                                />
                                <Label class="!mb-0">Has Backup Internet</Label>
                            </div>
                        </div>
                    </div>
                </template>

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
                        {{ submitting ? 'Saving...' : (editingUser ? 'Update' : 'Create') }}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    </AuthenticatedLayout>
</template>

