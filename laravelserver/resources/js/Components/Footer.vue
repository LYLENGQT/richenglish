<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">Rich English</h3>
          <p class="text-gray-400">
            Where Kindness Leads, English Follows, Growth Lasts.
          </p>
        </div>
        <div>
          <h4 class="font-bold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-gray-400">
            <li>
              <Link :href="route('welcome')" class="hover:text-white">Home</Link>
            </li>
            <li>
              <Link :href="route('about')" class="hover:text-white">About</Link>
            </li>
            <li>
              <Link :href="route('teacher-application')" class="hover:text-white">Apply to Teach</Link>
            </li>
            <li>
              <Link :href="route('faq')" class="hover:text-white">FAQ</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Support</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-white">Help Center</a></li>
            <li><a href="#" class="hover:text-white">Terms of Service</a></li>
            <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Contact Info</h4>
          <ul class="space-y-2 text-gray-400">
            <li>Email: info@richenglish.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Available 24/7</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Rich English. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
</script>

