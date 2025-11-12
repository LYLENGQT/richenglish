<template>
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
      <!-- Left Side - Branding -->
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
              Empower every student with confident English communication.
            </h2>
            <p class="text-white/75">
              Personalised tracking, seamless communication, and smart
              tools—built for teachers who want to focus on what matters most:
              inspiring progress.
            </p>
          </div>
        </div>

        <div class="relative z-10 space-y-3 text-sm text-white/75">
          <p>Need a hand? Email us at support@richenglish.com</p>
          <p>© {{ new Date().getFullYear() }} Rich English</p>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div
        class="w-full bg-white/95 px-8 py-12 sm:px-12 lg:px-16"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div class="mx-auto w-full max-w-md">
          <div class="flex flex-col items-center text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
              RE
            </div>
            <h1 class="mt-6 text-3xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p class="mt-2 text-sm text-slate-500">
              Sign in to keep your classes organised and your students
              engaged.
            </p>
          </div>

          <form class="mt-10 space-y-8" @submit.prevent="submit">
            <div v-if="status" class="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600">
              {{ status }}
            </div>

            <div class="space-y-6">
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
                  v-model="form.email"
                  placeholder="you@richenglish.com"
                  autocomplete="email"
                  required
                  class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': form.errors.email }"
                />
                <p v-if="form.errors.email" class="mt-1 text-xs font-medium text-rose-500">
                  {{ form.errors.email }}
                </p>
              </div>

              <div>
                <label
                  for="password"
                  class="text-sm font-medium text-slate-600"
                >
                  Password
                </label>
                <div class="relative mt-2">
                  <input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    required
                    class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 pr-14 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': form.errors.password }"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-3 flex items-center rounded-full p-2 text-slate-400 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <svg
                      v-if="showPassword"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
                <p v-if="form.errors.password" class="mt-1 text-xs font-medium text-rose-500">
                  {{ form.errors.password }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                for="remember"
                class="flex items-center gap-2 text-sm font-medium text-slate-600"
              >
                <input
                  id="remember"
                  type="checkbox"
                  v-model="form.remember"
                  class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link
                v-if="canResetPassword"
                :href="route('password.request')"
                class="text-sm font-semibold text-blue-600 transition hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              :disabled="form.processing"
              class="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {{ form.processing ? 'Signing in...' : 'Log in' }}
            </button>

            <p class="text-center text-sm text-slate-500">
              Don't have an account?
              <Link
                :href="route('register')"
                class="ml-2 font-semibold text-blue-600 transition hover:text-blue-500"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AOS from 'aos';

defineProps({
  canResetPassword: {
    type: Boolean,
  },
  status: {
    type: String,
  },
});

const showPassword = ref(false);

// Get remembered email from localStorage if available
const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('rememberedEmail') || '' : '';

const form = useForm({
  email: savedEmail,
  password: '',
  remember: !!savedEmail,
});

const submit = () => {
  form.post(route('login'), {
    onFinish: () => {
      form.reset('password');
      
      // Save email to localStorage if remember is checked
      if (form.remember && typeof window !== 'undefined') {
        localStorage.setItem('rememberedEmail', form.email);
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('rememberedEmail');
      }
    },
    onSuccess: () => {
      // Navigation is handled by Laravel's redirect in AuthenticatedSessionController
    },
  });
};

onMounted(() => {
  AOS.refresh();
});
</script>
