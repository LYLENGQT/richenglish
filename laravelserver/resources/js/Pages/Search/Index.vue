<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';
import Button from '@/Components/ui/Button.vue';
import { MagnifyingGlassIcon, UserIcon, UserGroupIcon, CalendarIcon, BookOpenIcon } from '@heroicons/vue/24/outline';

const loading = ref(false);
const searchQuery = ref('');
const searchType = ref('all');
const searchResults = ref(null);
const debounceTimer = ref(null);

const searchTypes = [
    { value: 'all', label: 'All', icon: MagnifyingGlassIcon },
    { value: 'students', label: 'Students', icon: UserGroupIcon },
    { value: 'teachers', label: 'Teachers', icon: UserIcon },
    { value: 'classes', label: 'Classes', icon: CalendarIcon },
    { value: 'books', label: 'Books', icon: BookOpenIcon },
];

const performSearch = async () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = null;
        return;
    }

    loading.value = true;
    try {
        const { data } = await api.get('/search', {
            params: {
                q: searchQuery.value,
                type: searchType.value,
            },
        });
        searchResults.value = data;
    } catch (error) {
        console.error('Error searching:', error);
    } finally {
        loading.value = false;
    }
};

const debouncedSearch = () => {
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
    }
    debounceTimer.value = setTimeout(() => {
        performSearch();
    }, 300);
};

watch([searchQuery, searchType], () => {
    debouncedSearch();
});

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getTypeIcon = (type) => {
    const typeMap = {
        student: UserGroupIcon,
        teacher: UserIcon,
        class: CalendarIcon,
        book: BookOpenIcon,
    };
    return typeMap[type] || MagnifyingGlassIcon;
};

const getTypeColor = (type) => {
    const colorMap = {
        student: 'bg-blue-100 text-blue-800',
        teacher: 'bg-purple-100 text-purple-800',
        class: 'bg-green-100 text-green-800',
        book: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
};

onMounted(() => {
    // Focus search input on mount
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.focus();
    }
});
</script>

<template>
    <Head title="Search" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Search
                    </h2>
                    <p class="text-sm text-gray-500">
                        Search across students, teachers, classes, and books.
                    </p>
                </div>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <!-- Search Bar -->
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div class="space-y-4">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search students, teachers, classes, books..."
                                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <!-- Search Type Filters -->
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="type in searchTypes"
                                :key="type.value"
                                @click="searchType = type.value"
                                :class="[
                                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                    searchType === type.value
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                ]"
                            >
                                <component :is="type.icon" class="h-4 w-4" />
                                {{ type.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="text-center py-12">
                    <p class="text-gray-500">Searching...</p>
                </div>

                <!-- Search Results Summary -->
                <div v-if="searchResults && searchResults.summary && searchResults.summary.total > 0" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Search Results</h3>
                    <div class="flex flex-wrap gap-4 text-sm">
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">Total:</span>
                            <span class="text-gray-900">{{ searchResults.summary.total }}</span>
                        </div>
                        <div v-if="searchResults.summary.students > 0" class="flex items-center gap-2">
                            <UserGroupIcon class="h-4 w-4 text-blue-500" />
                            <span class="text-gray-700">{{ searchResults.summary.students }} Students</span>
                        </div>
                        <div v-if="searchResults.summary.teachers > 0" class="flex items-center gap-2">
                            <UserIcon class="h-4 w-4 text-purple-500" />
                            <span class="text-gray-700">{{ searchResults.summary.teachers }} Teachers</span>
                        </div>
                        <div v-if="searchResults.summary.classes > 0" class="flex items-center gap-2">
                            <CalendarIcon class="h-4 w-4 text-green-500" />
                            <span class="text-gray-700">{{ searchResults.summary.classes }} Classes</span>
                        </div>
                        <div v-if="searchResults.summary.books > 0" class="flex items-center gap-2">
                            <BookOpenIcon class="h-4 w-4 text-yellow-500" />
                            <span class="text-gray-700">{{ searchResults.summary.books }} Books</span>
                        </div>
                    </div>
                </div>

                <!-- Search Results List -->
                <div v-if="searchResults && searchResults.results && searchResults.results.length > 0" class="space-y-4">
                    <div
                        v-for="result in searchResults.results"
                        :key="`${result.type}-${result.id}`"
                        class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        @click="router.visit(result.url)"
                    >
                        <div class="flex items-start gap-4">
                            <div :class="['p-2 rounded-md', getTypeColor(result.type)]">
                                <component :is="getTypeIcon(result.type)" class="h-5 w-5" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <h4 class="text-lg font-semibold text-gray-900">
                                        {{ result.name || result.title || `${result.teacher} - ${result.student}` }}
                                    </h4>
                                    <span :class="['px-2 py-1 text-xs font-medium rounded', getTypeColor(result.type)]">
                                        {{ result.type }}
                                    </span>
                                </div>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <div v-if="result.type === 'student'">
                                        <p v-if="result.email">Email: {{ result.email }}</p>
                                        <p v-if="result.identifier">ID: {{ result.identifier }}</p>
                                        <p v-if="result.nationality">Nationality: {{ result.nationality }}</p>
                                    </div>
                                    <div v-else-if="result.type === 'teacher'">
                                        <p v-if="result.email">Email: {{ result.email }}</p>
                                        <p v-if="result.role">Role: {{ result.role }}</p>
                                    </div>
                                    <div v-else-if="result.type === 'class'">
                                        <p v-if="result.teacher">Teacher: {{ result.teacher }}</p>
                                        <p v-if="result.student">Student: {{ result.student }}</p>
                                        <p v-if="result.book">Book: {{ result.book }}</p>
                                        <p v-if="result.date">Date: {{ formatDate(result.date) }} {{ result.time }}</p>
                                    </div>
                                    <div v-else-if="result.type === 'book'">
                                        <p v-if="result.filename">Filename: {{ result.filename }}</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                @click.stop="router.visit(result.url)"
                                variant="outline"
                                size="sm"
                            >
                                View
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="searchResults && searchResults.results && searchResults.results.length === 0" class="text-center py-12">
                    <MagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                    <p class="mt-1 text-sm text-gray-500">Try adjusting your search query.</p>
                </div>

                <div v-if="!searchQuery && !searchResults" class="text-center py-12">
                    <MagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Start searching</h3>
                    <p class="mt-1 text-sm text-gray-500">Enter a search query to find students, teachers, classes, or books.</p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

