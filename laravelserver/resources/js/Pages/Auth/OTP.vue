<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import api from '@/lib/api';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    email: {
        type: String,
        default: '',
    },
});

// Get email from props or URL query
const email = ref(props.email || new URLSearchParams(window.location.search).get('email') || '');
const otp = ref(['', '', '', '', '', '']);
const isSubmitting = ref(false);
const isResending = ref(false);
const timeLeft = ref(300); // 5 minutes
const inputRefs = ref([]);
const error = ref('');
const success = ref('');
let timerInterval = null;

// Redirect if no email and start timer
onMounted(() => {
    if (!email.value) {
        router.visit(route('password.request'));
        return;
    }

    // Start timer
    timerInterval = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
});

onUnmounted(() => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    otp.value[index] = value;
    error.value = '';

    if (value && index < 5) {
        inputRefs.value[index + 1]?.focus();
    }
};

const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp.value[index] && index > 0) {
        inputRefs.value[index - 1]?.focus();
    }
};

const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    pastedData.split('').forEach((char, index) => {
        if (index < 6) otp.value[index] = char;
    });

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.value[lastIndex]?.focus();
};

const onSubmit = async () => {
    if (timeLeft.value <= 0) {
        error.value = 'OTP has expired. Please request a new code.';
        return;
    }

    const otpCode = otp.value.join('');
    if (otpCode.length !== 6) {
        error.value = 'Please enter all 6 digits';
        return;
    }

    isSubmitting.value = true;
    error.value = '';
    success.value = '';

    try {
        await api.post('/verify-otp', { otp: otpCode });
        router.visit(route('password.reset') + '?email=' + encodeURIComponent(email.value));
    } catch (err) {
        error.value = err.response?.data?.message || 'Invalid OTP. Please try again.';
        otp.value = ['', '', '', '', '', ''];
        inputRefs.value[0]?.focus();
    } finally {
        isSubmitting.value = false;
    }
};

const handleResend = async () => {
    isResending.value = true;
    error.value = '';
    success.value = '';

    try {
        await api.post('/resend-otp', { email: email.value });
        success.value = 'OTP resent to your email';
        otp.value = ['', '', '', '', '', ''];
        timeLeft.value = 300;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft.value--;
            if (timeLeft.value <= 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
        inputRefs.value[0]?.focus();
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
    } finally {
        isResending.value = false;
    }
};
</script>

<template>
    <Head title="Verify OTP" />

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
                            Check your email for the code.
                        </h2>
                        <p class="text-white/75">
                            We've sent a 6-digit verification code to your email address.
                            Enter it below to verify your identity.
                        </p>
                    </div>
                </div>

                <div class="relative z-10 space-y-3 text-sm text-white/75">
                    <p>Need a hand? Email us at support@richenglish.com</p>
                    <p>© {{ new Date().getFullYear() }} Rich English</p>
                </div>
            </div>

            <!-- Right Panel - OTP Form -->
            <div
                class="w-full bg-white/95 px-8 py-12 sm:px-12 lg:px-16"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <div class="mx-auto w-full max-w-md">
                    <Link
                        :href="route('password.request')"
                        class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        <ArrowLeftIcon class="h-4 w-4" />
                        Back
                    </Link>

                    <div class="mt-8 flex flex-col items-center text-center">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                            RE
                        </div>
                        <h1 class="mt-6 text-3xl font-semibold text-slate-900">
                            Enter verification code
                        </h1>
                        <p class="mt-2 text-sm text-slate-500">
                            We sent a code to
                            <span class="font-medium text-slate-700">{{ email }}</span>
                        </p>

                        <!-- Timer Display -->
                        <div class="mt-4">
                            <p
                                v-if="timeLeft > 0"
                                class="text-sm font-medium text-blue-600"
                            >
                                Code expires in {{ formatTime(timeLeft) }}
                            </p>
                            <p
                                v-else
                                class="text-sm font-medium text-rose-500"
                            >
                                Code has expired
                            </p>
                        </div>
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

                        <!-- OTP Input Boxes -->
                        <div class="flex justify-center gap-2 sm:gap-3">
                            <input
                                v-for="(digit, index) in otp"
                                :key="index"
                                :ref="(el) => { if (el) inputRefs[index] = el }"
                                type="text"
                                inputmode="numeric"
                                maxlength="1"
                                :value="digit"
                                @input="handleChange(index, $event.target.value)"
                                @keydown="handleKeyDown(index, $event)"
                                @paste="index === 0 ? handlePaste($event) : undefined"
                                class="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border-2 border-slate-200 bg-white text-center text-xl font-semibold text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                autocomplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="isSubmitting || otp.some((d) => !d) || timeLeft <= 0"
                            class="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {{ isSubmitting ? 'Verifying...' : timeLeft <= 0 ? 'Code Expired' : 'Verify' }}
                        </button>

                        <div class="text-center">
                            <p class="text-sm text-slate-500">
                                Didn't receive the code?
                                <button
                                    type="button"
                                    @click="handleResend"
                                    :disabled="isResending"
                                    class="font-semibold text-blue-600 transition hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed underline"
                                >
                                    {{ isResending ? 'Resending...' : 'Resend Email' }}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
