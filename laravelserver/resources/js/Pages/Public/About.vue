<template>
  <div class="min-h-screen bg-white">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" data-aos="fade-up">
          About Rich English
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Welcome to Rich English — Where Kindness Leads, English Follows,
          Growth Lasts.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p class="text-xl text-gray-600 max-w-4xl mx-auto">
            To deliver English learning that's truly
            <span class="font-bold text-blue-600">R.I.C.H.</span> for every
            Korean and Chinese student:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Relevant -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="50">
            <div
              class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl font-bold text-blue-600">R</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Relevant</h3>
            <p class="text-gray-600">To real-life communication</p>
          </div>

          <!-- Inclusive -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="150">
            <div
              class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl font-bold text-green-600">I</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Inclusive</h3>
            <p class="text-gray-600">
              Of all learners, regardless of level or background
            </p>
          </div>

          <!-- Committed -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="250">
            <div
              class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl font-bold text-purple-600">C</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Committed</h3>
            <p class="text-gray-600">
              To delivering excellence in every class
            </p>
          </div>

          <!-- Hands-on -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="350">
            <div
              class="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl font-bold text-orange-600">H</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Hands-on</h3>
            <p class="text-gray-600">
              Through practical, interactive, and engaging lessons
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <p class="text-xl text-gray-600 mb-8">
              To be a place of growth for both teachers and students across
              generations.
            </p>
            <div class="space-y-4">
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-red-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span class="text-gray-700">
                  Kindness-first approach to learning
                </span>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-blue-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-gray-700">
                  Global community of learners
                </span>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-green-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span class="text-gray-700">
                  Continuous growth and development
                </span>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-purple-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span class="text-gray-700">
                  Interactive and engaging lessons
                </span>
              </div>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl"
            data-aos="fade-left"
            data-aos-delay="150"
          >
            <h3 class="text-2xl font-bold text-gray-900 mb-6">
              Why Choose Rich English?
            </h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-yellow-500 mr-3 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <div>
                  <h4 class="font-bold text-gray-900">Expert Teachers</h4>
                  <p class="text-gray-600">
                    Certified educators with years of experience
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-blue-500 mr-3 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <h4 class="font-bold text-gray-900">Diverse Community</h4>
                  <p class="text-gray-600">
                    Students from Korea and China learning together
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-green-500 mr-3 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div>
                  <h4 class="font-bold text-gray-900">Proven Results</h4>
                  <p class="text-gray-600">
                    Track record of student success and growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div data-aos="fade-up" data-aos-delay="50">
            <div class="text-4xl font-bold mb-2">1000+</div>
            <div class="text-blue-100">Active Students</div>
          </div>
          <div data-aos="fade-up" data-aos-delay="120">
            <div class="text-4xl font-bold mb-2">50+</div>
            <div class="text-blue-100">Expert Teachers</div>
          </div>
          <div data-aos="fade-up" data-aos-delay="190">
            <div class="text-4xl font-bold mb-2">10+</div>
            <div class="text-blue-100">Years Experience</div>
          </div>
          <div data-aos="fade-up" data-aos-delay="260">
            <div class="text-4xl font-bold mb-2">98%</div>
            <div class="text-blue-100">Success Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6" data-aos="fade-up">
          Ready to Start Your English Journey?
        </h2>
        <p class="text-xl text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">
          Join our community of learners and experience the R.I.C.H. approach
          to English learning.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            :href="route('login')"
            class="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Learning Today
          </Link>
          <Link
            :href="route('teacher-application')"
            class="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            Apply to Teach
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import Header from '@/Components/Header.vue';
import Footer from '@/Components/Footer.vue';
import AOS from 'aos';

onMounted(() => {
  AOS.refresh();
});
</script>
