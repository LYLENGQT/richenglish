<script setup>
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import api from '@/lib/api';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const email = ref('');
const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const onSubmit = async (e) => {
    e.preventDefault();
    isSubmitting.value = true;
    error.value = '';
    success.value = '';

    if (!email.value) {
        error.value = 'Email is required';
        isSubmitting.value = false;
        return;
    }

    try {
        await api.post('/forgot-password', { email: email.value });
        success.value = 'OTP sent to your email successfully';
        setTimeout(() => {
            router.visit(route('otp.verify') + '?email=' + encodeURIComponent(email.value));
        }, 1000);
    } catch (err) {
        error.value = err.response?.data?.message || 'Something went wrong. Please try again later.';
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <Head title="Forgot Password" />

    <div
        class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 py-12 px-4 sm:px-8 lg:px-12"
        data-aos="fade-up"
    >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%)]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(125,211,252,0.18),_transparent_55%)]" />

        <div
            class="relative z-10 mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white/95 shadow-2xl shadow-blue-900/25 backdrop-blur-lg lg:flex-row"
            data-aos="fade-up"
            data-aos-delay="120"
        >
            <!-- Left Panel -->
            <div class="relative hidden w-full max-w-md flex-shrink-0 flex-col justify-between bg-gradient-to-b from-blue-600 via-blue-500 to-indigo-600 p-10 text-white lg:flex">
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-20" />
                <div class="absolute inset-0 bg-gradient-to-b from-blue-600/80 via-blue-600/70 to-indigo-700/85" />

                <div class="relative z-10 space-y-6">
                    <Link
                        :href="route('welcome')"
                        class="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-white/80 transition hover:border-white hover:text-white"
                    >
                        Rich English
                    </Link>
                    <div class="space-y-5">
                        <h2 class="text-3xl font-semibold leading-tight">
                            Reset your password securely.
                        </h2>
                        <p class="text-white/75">
                            Enter your email address and we'll send you a one-time password
                            to verify your identity and reset your password.
                        </p>
                    </div>
                </div>

                <div class="relative z-10 space-y-3 text-sm text-white/75">
                    <p>Need a hand? Email us at support@richenglish.com</p>
                    <p>© {{ new Date().getFullYear() }} Rich English</p>
                </div>
            </div>

            <!-- Right Panel - Form -->
            <div
                class="w-full bg-white/95 px-8 py-12 sm:px-12 lg:px-16"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <div class="mx-auto w-full max-w-md">
                    <Link
                        :href="route('login')"
                        class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        <ArrowLeftIcon class="h-4 w-4" />
                        Back to login
                    </Link>

                    <div class="mt-8 flex flex-col items-center text-center">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                            RE
                        </div>
                        <h1 class="mt-6 text-3xl font-semibold text-slate-900">
                            Forgot password?
                        </h1>
                        <p class="mt-2 text-sm text-slate-500">
                            No worries! Enter your email and we'll send you a code to reset
                            your password.
                        </p>
                    </div>

                    <form @submit.prevent="onSubmit" class="mt-10 space-y-8">
                        <!-- Success Message -->
                        <div v-if="success" class="rounded-2xl bg-green-50 p-4 text-sm text-green-600">
                            {{ success }}
                        </div>

                        <!-- Error Message -->
                        <div v-if="error" class="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
                            {{ error }}
                        </div>

                        <div>
                            <label
                                for="email"
                                class="text-sm font-medium text-slate-600"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                v-model="email"
                                placeholder="you@richenglish.com"
                                autocomplete="email"
                                required
                                class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
                                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': error }"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {{ isSubmitting ? 'Sending...' : 'Send reset code' }}
                        </button>

                        <p class="text-center text-sm text-slate-500">
                            Remember your password?
                            <Link
                                :href="route('login')"
                                class="ml-2 font-semibold text-blue-600 transition hover:text-blue-500"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
