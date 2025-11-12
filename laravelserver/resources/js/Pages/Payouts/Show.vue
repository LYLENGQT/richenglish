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
import { ArrowLeftIcon, TrashIcon, BanknotesIcon, UserIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ payoutId: { type: [String, Number], required: true } });
const page = usePage();
const role = computed(() => page.props.auth?.user?.role ?? 'teacher');
const isSuperAdmin = computed(() => role.value === 'super-admin');

const loading = ref(false);
const payout = ref(null);
const deleteDialogOpen = ref(false);

const fetchPayout = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/payout/${props.payoutId}`);
        payout.value = data;
    } catch (error) {
        console.error('Error fetching payout:', error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    try {
        loading.value = true;
        await api.delete(`/payout/${props.payoutId}`);
        router.visit(route('payouts.index'));
    } catch (error) {
        console.error('Error deleting payout:', error);
        deleteDialogOpen.value = false;
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

onMounted(fetchPayout);
</script>

<template>
    <Head :title="payout ? `Payout Details` : 'Payout Details'" />
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="router.visit(route('payouts.index'))" class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <ArrowLeftIcon class="h-5 w-5" />
                    </button>
                    <div>
                        <h2 class="text-xl font-semibold leading-tight text-gray-800">Payout Details</h2>
                        <p class="text-sm text-gray-500">{{ payout?.teacher?.name ?? 'Loading...' }}</p>
                    </div>
                </div>
                <Button v-if="isSuperAdmin" @click="deleteDialogOpen = true" variant="destructive" :disabled="loading">
                    <TrashIcon class="h-4 w-4 mr-2" />Delete
                </Button>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div v-if="loading && !payout" class="text-center py-12 text-gray-500">Loading payout information...</div>
                <template v-else-if="payout">
                    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div class="border-b border-gray-200 px-6 py-4"><h3 class="text-lg font-semibold text-gray-900">Payout Information</h3></div>
                        <div class="px-6 py-4">
                            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div><dt class="text-sm font-medium text-gray-500">Teacher</dt><dd class="mt-1 text-sm text-gray-900">{{ payout.teacher?.name ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Start Date</dt><dd class="mt-1 text-sm text-gray-900">{{ formatDate(payout.start_date) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">End Date</dt><dd class="mt-1 text-sm text-gray-900">{{ formatDate(payout.end_date) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Duration</dt><dd class="mt-1 text-sm text-gray-900">{{ payout.duration ?? '—' }} hrs</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Total Classes</dt><dd class="mt-1 text-sm text-gray-900">{{ payout.total_class ?? '—' }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Incentives</dt><dd class="mt-1 text-sm text-gray-900">₱{{ Number(payout.incentives ?? 0).toFixed(2) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Amount</dt><dd class="mt-1 text-sm font-semibold text-gray-900">₱{{ Number(payout.amount ?? 0).toFixed(2) }}</dd></div>
                                <div><dt class="text-sm font-medium text-gray-500">Status</dt><dd class="mt-1 text-sm text-gray-900">
                                    <span :class="{ 'bg-yellow-100 text-yellow-800': payout.status === 'pending', 'bg-blue-100 text-blue-800': payout.status === 'processing', 'bg-green-100 text-green-800': payout.status === 'completed' }" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{ payout.status ?? '—' }}</span>
                                </dd></div>
                                <div class="sm:col-span-2 lg:col-span-3"><dt class="text-sm font-medium text-gray-500">Notes</dt><dd class="mt-1 text-sm text-gray-900">{{ payout.notes ?? '—' }}</dd></div>
                            </dl>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <Dialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
            <div>
                <DialogHeader>
                    <DialogTitle>Delete Payout</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this payout? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="handleDelete" :disabled="loading">Delete</Button>
                </DialogFooter>
            </div>
        </Dialog>
    </AuthenticatedLayout>
</template>

