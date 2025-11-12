<template>
  <header class="bg-white shadow-sm relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Link :href="route('welcome')" class="text-2xl font-bold text-blue-600">
              Rich English
            </Link>
          </div>
          <div class="hidden lg:block ml-4">
            <span class="text-sm text-gray-500">
              Where Kindness Leads, English Follows, Growth Lasts
            </span>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="isOpen = !isOpen"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="isOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <nav class="hidden md:flex items-center gap-8 sm:gap-4">
          <Link :href="route('welcome')" class="text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link :href="route('about')" class="text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link :href="route('teacher-application')" class="text-gray-700 hover:text-blue-600 transition-colors">
            Apply
          </Link>
          <Link :href="route('faq')" class="text-gray-700 hover:text-blue-600 transition-colors">
            FAQ
          </Link>
          <Link :href="route('teacher-leaderboard')" class="text-gray-700 hover:text-blue-600 transition-colors">
            Leaderboard
          </Link>
          <Link :href="route('contact')" class="text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
          <Link :href="route('login')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Teacher Login
          </Link>
        </nav>
      </div>

      <!-- Mobile navigation -->
      <div
        :class="[isOpen ? 'block' : 'hidden']"
        class="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <div class="lg:hidden ml-3">
            <span class="text-sm text-gray-500">
              Where Kindness Leads, English Follows, Growth Lasts
            </span>
          </div>
          <Link :href="route('welcome')" class="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link :href="route('about')" class="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link :href="route('teacher-application')" class="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Apply
          </Link>
          <Link :href="route('faq')" class="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            FAQ
          </Link>
          <Link :href="route('teacher-leaderboard')" class="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Leaderboard
          </Link>
          <Link :href="route('contact')" class="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
          <Link :href="route('login')" class="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Teacher Login
          </Link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const isOpen = ref(false);
</script>

