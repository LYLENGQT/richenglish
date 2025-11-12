<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" data-aos="fade-up">
          Transform Lives Through English
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Join Rich English as a teacher and make a difference in students' lives
          with our R.I.C.H. approach
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
          <Link
            :href="route('teacher-application')"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </Link>
          <Link
            :href="route('about')"
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>

    <!-- R.I.C.H. Approach Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our R.I.C.H. Approach
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe in a holistic approach to English education that goes
            beyond just language learning
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Respect -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="50">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Respect</h3>
            <p class="text-gray-600">
              We respect every student's unique learning journey and cultural
              background
            </p>
                                </div>

          <!-- Integrity -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="150">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Integrity
            </h3>
            <p class="text-gray-600">
              We maintain the highest standards of honesty and professionalism
              in all our interactions
            </p>
          </div>

          <!-- Commitment -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="250">
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
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Commitment
            </h3>
            <p class="text-gray-600">
              We are committed to providing consistent, high-quality education
              and support
                                </p>
                            </div>

          <!-- Hope -->
          <div class="text-center" data-aos="fade-up" data-aos-delay="350">
            <div
              class="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                            <svg
                class="w-8 h-8 text-orange-600"
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
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Hope</h3>
            <p class="text-gray-600">
              We inspire hope and confidence in our students' ability to achieve
              their dreams
            </p>
          </div>
        </div>
                            </div>
    </section>

    <!-- Why Join Us Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Join Rich English?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of a community that values growth, learning, and making a
            positive impact
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="bg-white p-6 rounded-lg shadow-md"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div class="flex items-center mb-4">
              <svg
                class="w-6 h-6 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                                />
                            </svg>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ benefit.title }}
              </h3>
            </div>
            <p class="text-gray-600">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Teachers Say
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our amazing teachers about their experience with Rich
            English
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="bg-white p-6 rounded-lg shadow-md"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div class="flex items-center mb-4">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                                        <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                </svg>
                            </div>
            <p class="text-gray-600 mb-4">{{ testimonial.quote }}</p>
            <div class="font-semibold text-gray-900">
              {{ testimonial.name }}
            </div>
            <div class="text-sm text-gray-500">{{ testimonial.role }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">
          Ready to Make a Difference?
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Join our community of passionate educators and help students achieve
          their English learning goals
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
          <Link
            :href="route('teacher-application')"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Application
          </Link>
          <Link
            :href="route('contact')"
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-12" data-aos="fade-up">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p class="text-xl text-gray-600">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6" data-aos="fade-up" data-aos-delay="100">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                        </div>
                    </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="4"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="text-center">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
    </div>
</template>

<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import Header from '@/Components/Header.vue';
import Footer from '@/Components/Footer.vue';
import api from '@/lib/api';
import AOS from 'aos';

onMounted(() => {
  AOS.refresh();
});

defineProps({
  canLogin: Boolean,
  canRegister: Boolean,
  laravelVersion: String,
  phpVersion: String,
});

const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
});

const isSubmitting = ref(false);

const benefits = [
  {
    title: 'Competitive Pay',
    description:
      'We offer competitive compensation packages that recognize your expertise and dedication',
  },
  {
    title: 'Flexible Schedule',
    description:
      'Work with a schedule that fits your lifestyle and personal commitments',
  },
  {
    title: 'Professional Development',
    description:
      'Access to ongoing training and development opportunities to enhance your skills',
  },
  {
    title: 'Supportive Community',
    description:
      'Join a community of passionate educators who support and inspire each other',
  },
  {
    title: 'Modern Technology',
    description:
      'Access to cutting-edge teaching tools and platforms to enhance your lessons',
  },
  {
    title: 'Make a Difference',
    description:
      'Help students achieve their dreams and make a lasting impact on their lives',
  },
];

const testimonials = [
  {
    quote:
      "Teaching with Rich English has been incredibly rewarding. The support and resources provided are outstanding.",
    name: 'Sarah Johnson',
    role: 'English Teacher, 3 years',
  },
  {
    quote:
      "The R.I.C.H. approach really works. I've seen my students grow not just in English, but in confidence too.",
    name: 'Michael Chen',
    role: 'English Teacher, 2 years',
  },
  {
    quote:
      'The flexible schedule allows me to balance work and family perfectly. Highly recommended!',
    name: 'Emily Rodriguez',
    role: 'English Teacher, 4 years',
  },
];

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    
    const response = await api.post('/teacher-applications', formData.value);
    
    formData.value = { name: '', email: '', phone: '', message: '' };
    alert(response.data.message || 'Application submitted! Our team will review and reach out soon.');
  } catch (error) {
    console.error('Application error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Failed to submit application. Please try again later.';
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
