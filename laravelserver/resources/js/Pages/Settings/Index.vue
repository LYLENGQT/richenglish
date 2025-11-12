<script setup>
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Button from '@/Components/ui/Button.vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

const saving = ref(false);

const handleSave = () => {
    saving.value = true;
    // TODO: Implement settings save functionality
    setTimeout(() => {
        saving.value = false;
        alert('Settings saved successfully!');
    }, 1000);
};
</script>

<template>
    <Head title="Settings" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        System Settings
                    </h2>
                    <p class="text-sm text-gray-500">
                        Configure system-wide settings and preferences.
                    </p>
                </div>
                <Button
                    @click="handleSave"
                    :disabled="saving"
                >
                    {{ saving ? 'Saving...' : 'Save Settings' }}
                </Button>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-4 mb-6">
                        <Cog6ToothIcon class="h-8 w-8 text-gray-400" />
                        <h3 class="text-lg font-semibold text-gray-900">General Settings</h3>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Application Name
                            </label>
                            <input
                                type="text"
                                value="Rich English"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                disabled
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Default Timezone
                            </label>
                            <select class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option>UTC</option>
                                <option>America/New_York</option>
                                <option>Asia/Seoul</option>
                                <option>Asia/Shanghai</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                SMTP Host
                            </label>
                            <input
                                type="text"
                                placeholder="smtp.example.com"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                SMTP Port
                            </label>
                            <input
                                type="number"
                                placeholder="587"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Default Hourly Rate ($)
                            </label>
                            <input
                                type="number"
                                value="200"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

