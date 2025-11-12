<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" data-aos="fade-up">Contact Us</h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Get in touch with our team. We're here to help you with any questions
          about Rich English.
        </p>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p class="text-xl text-gray-600">
            We're here to help you succeed in your English learning journey
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="text-center p-6 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="50">
            <div
              class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p class="text-gray-600 mb-4">Send us an email anytime</p>
            <a
              href="mailto:info@richenglish.com"
              class="text-blue-600 font-medium"
            >
              info@richenglish.com
            </a>
          </div>

          <div class="text-center p-6 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="150">
            <div
              class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p class="text-gray-600 mb-4">Speak with our support team</p>
            <a href="tel:+15551234567" class="text-green-600 font-medium">
              +1 (555) 123-4567
            </a>
          </div>

          <div class="text-center p-6 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="250">
            <div
              class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Available 24/7
            </h3>
            <p class="text-gray-600 mb-4">We're always here to help</p>
            <p class="text-purple-600 font-medium">Monday - Sunday</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-lg p-8" data-aos="fade-up">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p class="text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-aos="fade-up" data-aos-delay="150">
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="200">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-aos="fade-up" data-aos-delay="250">
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="300">
                <label
                  for="inquiryType"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  v-model="formData.inquiryType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="student">Student Support</option>
                  <option value="teacher">Teacher Application</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="350">
              <label
                for="subject"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                v-model="formData.subject"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="400">
              <label
                for="message"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="6"
                required
                placeholder="Please describe your inquiry in detail..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="text-center" data-aos="fade-up" data-aos-delay="450">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Additional Contact Methods -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Other Ways to Connect
          </h2>
          <p class="text-xl text-gray-600">
            Choose the method that works best for you
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            class="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg"
            data-aos="fade-right"
          >
            <div class="flex items-center mb-4">
              <svg
                class="w-8 h-8 text-blue-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 class="text-xl font-bold text-gray-900">
                Live Chat Support
              </h3>
            </div>
            <p class="text-gray-600 mb-4">
              Get instant help from our support team through our live chat
              feature.
            </p>
            <button
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chat
            </button>
          </div>

          <div
            class="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div class="flex items-center mb-4">
              <svg
                class="w-8 h-8 text-green-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 class="text-xl font-bold text-gray-900">Social Media</h3>
            </div>
            <p class="text-gray-600 mb-4">
              Follow us on social media for updates, tips, and community
              support.
            </p>
            <div class="flex space-x-4">
              <a
                href="#"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Quick Links -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6" data-aos="fade-up">
          Quick Help
        </h2>
        <p class="text-xl text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">
          Find answers to common questions before reaching out
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
          <Link
            :href="route('faq')"
            class="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            View FAQ
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
import { ref, onMounted } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import Header from '@/Components/Header.vue';
import Footer from '@/Components/Footer.vue';
import api from '@/lib/api';
import AOS from 'aos';

onMounted(() => {
  AOS.refresh();
});

const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  inquiryType: 'general',
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    const response = await api.post('/contact', formData.value);
    alert(
      response.data.message ||
        'Thank you for your message! We will get back to you within 24 hours.'
    );
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: 'general',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage =
      error.response?.data?.message ||
      'Failed to send message. Please try again later.';
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
