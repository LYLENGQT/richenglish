<script setup>
import { computed, ref } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import {
    HomeIcon,
    UserGroupIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BookOpenIcon,
    BanknotesIcon,
    FolderOpenIcon,
    VideoCameraIcon,
    MagnifyingGlassIcon,
    Cog6ToothIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/vue/24/outline';

const page = usePage();
const sidebarOpen = ref(false);
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const name = computed(() => page.props.auth?.user?.name ?? 'User');

const getNavigation = (role) => {
    if (role === 'teacher') {
        return [
            {
                group: 'Main',
                items: [
                    { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
                ],
            },
            {
                group: 'My Classes',
                items: [
                    { name: 'My Schedule', href: route('schedule.index'), icon: CalendarIcon },
                    { name: 'Classes', href: route('classes.index'), icon: CalendarIcon },
                    { name: 'Makeup Classes', href: route('makeup-classes.index'), icon: ClockIcon },
                ],
            },
            {
                group: 'Students & Attendance',
                items: [
                    { name: 'My Students', href: route('students.index'), icon: UserGroupIcon },
                    { name: 'Attendance', href: route('attendance.index'), icon: ClipboardDocumentListIcon },
                ],
            },
            {
                group: 'Resources',
                items: [
                    { name: 'Books', href: route('books.index'), icon: BookOpenIcon },
                    { name: 'Recordings', href: route('recordings.index'), icon: VideoCameraIcon },
                    { name: 'Reports', href: route('reports.index'), icon: FolderOpenIcon },
                ],
            },
        ];
    }

    if (role === 'admin') {
        return [
            {
                group: 'Main',
                items: [
                    { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
                ],
            },
            {
                group: 'User Management',
                items: [
                    { name: 'Teachers', href: route('teachers.index'), icon: UsersIcon },
                    { name: 'Students', href: route('students.index'), icon: UserGroupIcon },
                ],
            },
            {
                group: 'Classes & Attendance',
                items: [
                    { name: 'Schedules', href: route('classes.index'), icon: CalendarIcon },
                    { name: 'Attendance', href: route('attendance.index'), icon: ClipboardDocumentListIcon },
                ],
            },
            {
                group: 'Reports & Media',
                items: [
                    { name: 'Reports', href: route('reports.index'), icon: FolderOpenIcon },
                    { name: 'Screenshots', href: route('screenshots.index'), icon: VideoCameraIcon },
                    { name: 'Recordings', href: route('recordings.index'), icon: VideoCameraIcon },
                ],
            },
            {
                group: 'Resources',
                items: [
                    { name: 'Books Archive', href: route('books.index'), icon: BookOpenIcon },
                ],
            },
            {
                group: 'Tools',
                items: [
                    { name: 'Search', href: route('search.index'), icon: MagnifyingGlassIcon },
                ],
            },
        ];
    }

    if (role === 'super-admin') {
        return [
            {
                group: 'Main',
                items: [
                    { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
                ],
            },
            {
                group: 'User Management',
                items: [
                    { name: 'Teachers', href: route('teachers.index'), icon: UsersIcon },
                    { name: 'Teacher Applications', href: route('teacher-applications.index'), icon: ClipboardDocumentCheckIcon },
                    { name: 'Admins', href: route('admins.index'), icon: UsersIcon },
                    { name: 'Students', href: route('students.index'), icon: UserGroupIcon },
                ],
            },
            {
                group: 'Classes & Attendance',
                items: [
                    { name: 'Schedules', href: route('classes.index'), icon: CalendarIcon },
                    { name: 'Attendance', href: route('attendance.index'), icon: ClipboardDocumentListIcon },
                ],
            },
            {
                group: 'Content Management',
                items: [
                    { name: 'Books Management', href: route('books.index'), icon: BookOpenIcon },
                    { name: 'Assign Books', href: route('assignments.index'), icon: BookOpenIcon },
                    { name: 'Curriculum Access', href: route('curriculum.index'), icon: FolderOpenIcon },
                ],
            },
            {
                group: 'Reports & Media',
                items: [
                    { name: 'Reports', href: route('reports.index'), icon: FolderOpenIcon },
                    { name: 'Screenshots', href: route('screenshots.index'), icon: VideoCameraIcon },
                    { name: 'Recordings', href: route('recordings.index'), icon: VideoCameraIcon },
                ],
            },
                  {
                      group: 'Financial',
                      items: [
                          { name: 'Salary Management', href: route('salary.index'), icon: BanknotesIcon },
                          { name: 'Payout Overview', href: route('payouts.index'), icon: BanknotesIcon },
                      ],
                  },
            {
                group: 'Tools',
                items: [
                    { name: 'Search', href: route('search.index'), icon: MagnifyingGlassIcon },
                    { name: 'Settings', href: route('settings.index'), icon: Cog6ToothIcon },
                ],
            },
        ];
    }

    return [];
};

const navigation = computed(() => getNavigation(role.value));

const isCurrentPath = (href) => {
    // Remove query parameters and hash from both URLs for comparison
    const currentUrl = page.url.split('?')[0].split('#')[0];
    const targetUrl = href.split('?')[0].split('#')[0];
    
    // Exact match
    if (currentUrl === targetUrl) {
        return true;
    }
    
    // For paths that start with the href, ensure it's a proper path segment
    // This prevents /teachers from matching /teachers-something
    // Only match if the next character is a slash or end of string
    if (currentUrl.startsWith(targetUrl + '/')) {
        return true;
    }
    
    return false;
};

const handleLogout = () => {
    router.post(route('logout'));
};
</script>

<template>
    <div class="h-screen flex overflow-hidden bg-gray-100">
        <!-- Mobile sidebar -->
        <div
            :class="{
                'fixed inset-0 flex z-40 md:hidden': true,
                hidden: !sidebarOpen,
            }"
        >
            <div
                class="fixed inset-0 bg-gray-600 bg-opacity-75"
                @click="sidebarOpen = false"
            />
            <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                        type="button"
                        class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        @click="sidebarOpen = false"
                    >
                        <XMarkIcon class="h-6 w-6 text-white" />
                    </button>
                </div>
                <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div class="flex-shrink-0 flex items-center px-4">
                        <h1 class="text-xl font-bold text-gray-900">Rich English</h1>
                    </div>
                    <nav class="mt-5 px-2 space-y-6">
                        <div v-for="group in navigation" :key="group.group" class="space-y-1">
                            <div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {{ group.group }}
                            </div>
                            <Link
                                v-for="item in group.items"
                                :key="item.name"
                                :href="item.href"
                                :class="{
                                    'bg-blue-100 text-blue-900': isCurrentPath(item.href),
                                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isCurrentPath(item.href),
                                }"
                                class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            >
                                <component :is="item.icon" class="mr-4 h-6 w-6" />
                                {{ item.name }}
                            </Link>
                        </div>
                    </nav>
                            </div>
                <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <div class="flex items-center">
                        <div class="ml-3">
                            <p class="text-base font-medium text-gray-700">{{ name }}</p>
                            <button
                                @click="handleLogout"
                                class="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                        </div>
                    </div>
                </div>

        <!-- Desktop sidebar -->
        <div class="hidden md:flex md:flex-shrink-0">
            <div class="flex flex-col w-64">
                <div class="flex flex-col h-0 flex-1">
                    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div class="flex items-center flex-shrink-0 px-4">
                            <h1 class="text-xl font-bold text-gray-900">Rich English</h1>
                        </div>
                        <nav class="mt-5 flex-1 px-2 bg-white space-y-6 overflow-y-auto">
                            <div v-for="group in navigation" :key="group.group" class="space-y-1">
                                <div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {{ group.group }}
                                </div>
                                <Link
                                    v-for="item in group.items"
                                    :key="item.name"
                                    :href="item.href"
                    :class="{
                                        'bg-blue-100 text-blue-900': isCurrentPath(item.href),
                                        'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isCurrentPath(item.href),
                                    }"
                                    class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                >
                                    <component :is="item.icon" class="mr-3 h-6 w-6" />
                                    {{ item.name }}
                                </Link>
                            </div>
                        </nav>
                    </div>
                    <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <div class="flex items-center w-full">
                            <div class="ml-3 flex-1">
                                <p class="text-sm font-medium text-gray-700">{{ name }}</p>
                                <button
                                    @click="handleLogout"
                                    class="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                                >
                                    <ArrowRightOnRectangleIcon class="h-4 w-4 mr-1" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="flex flex-col w-0 flex-1 overflow-hidden">
            <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                <button
                    type="button"
                    class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    @click="sidebarOpen = true"
                >
                    <Bars3Icon class="h-6 w-6" />
                </button>
            </div>
            <main class="flex-1 relative overflow-y-auto focus:outline-none">
                <div class="py-6">
                    <div class="sm:mx-auto px-4 sm:px-6 md:px-8">
                        <div v-if="$slots.header" class="mb-6">
                    <slot name="header" />
                        </div>
                        <slot />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
