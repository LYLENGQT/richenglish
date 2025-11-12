<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import api from '@/lib/api';

const page = usePage();
const isSuperAdmin = computed(() => page.props.auth?.user?.role === 'super-admin');

const loading = ref(false);
const payouts = ref([]);
const pagination = ref(null);
const filters = reactive({
    teacher_id: '',
    status: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 10,
});

const fetchPayouts = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/payout', { params: filters });
        payouts.value = data.payouts;
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
    fetchPayouts();
};

const resetFilters = () => {
    filters.teacher_id = '';
    filters.status = '';
    filters.start_date = '';
    filters.end_date = '';
    filters.page = 1;
    fetchPayouts();
};

onMounted(fetchPayouts);
</script>

<template>
    <Head title="Payouts" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold leading-tight text-gray-800">
                        Payouts
                    </h2>
                    <p class="text-sm text-gray-500">
                        Review payout periods, monitor status, and confirm disbursements.
                    </p>
                </div>
                <button
                    @click="fetchPayouts"
                    class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    :disabled="loading"
                >
                    Refresh
                </button>
            </div>
        </template>

        <div class="py-10">
            <div class="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Teacher ID
                            </label>
                            <input
                                v-model="filters.teacher_id"
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Teacher ID"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                v-model="filters.status"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Any</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Start After
                            </label>
                            <input
                                v-model="filters.start_date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                End Before
                            </label>
                            <input
                                v-model="filters.end_date"
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="flex items-end gap-3">
                            <button
                                type="button"
                                @click="fetchPayouts"
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
                                        Teacher
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Period
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Duration
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Notes
                                    </th>
                                    <th v-if="isSuperAdmin" scope="col" class="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!loading && payouts.length === 0">
                                    <td
                                        :colspan="isSuperAdmin ? 6 : 5"
                                        class="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No payouts found.
                                    </td>
                                </tr>
                                <tr
                                    v-for="payout in payouts"
                                    :key="payout.id"
                                    class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    @click="isSuperAdmin && router.visit(route('payouts.show', payout.id))"
                                >
                                    <td class="px-6 py-4">
                                        {{ payout.teacher?.name ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ payout.start_date }} – {{ payout.end_date }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <div>
                                            {{ payout.duration }} minutes
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            Classes: {{ payout.total_class }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize"
                                            :class="{
                                                'bg-amber-100 text-amber-700': payout.status === 'pending',
                                                'bg-sky-100 text-sky-700': payout.status === 'processing',
                                                'bg-emerald-100 text-emerald-700': payout.status === 'completed',
                                            }"
                                        >
                                            {{ payout.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ payout.notes ?? '—' }}
                                    </td>
                                    <td v-if="isSuperAdmin" class="px-6 py-4" @click.stop>
                                        <button
                                            @click="router.visit(route('payouts.show', payout.id))"
                                            class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                        >
                                            View
                                        </button>
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
    </AuthenticatedLayout>
</template>

