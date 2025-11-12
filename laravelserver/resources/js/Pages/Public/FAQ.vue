<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" data-aos="fade-up">
          Frequently Asked Questions
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Find answers to common questions about Rich English, our teaching
          approach, and how to get started.
        </p>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-for="(category, categoryIndex) in faqs"
          :key="categoryIndex"
          class="mb-16"
          :data-aos="'fade-up'"
          :data-aos-delay="categoryIndex * 100"
        >
          <h2
            class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            {{ category.category }}
          </h2>

          <div class="space-y-4">
            <div
              v-for="(faq, questionIndex) in category.questions"
              :key="questionIndex"
              class="bg-white rounded-lg shadow-md"
              :data-aos="'fade-up'"
              :data-aos-delay="questionIndex * 50"
            >
              <button
                @click="toggleItem(categoryIndex + '-' + questionIndex)"
                class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <span class="text-lg font-medium text-gray-900">
                  {{ faq.question }}
                </span>
                <svg
                  v-if="openItems[categoryIndex + '-' + questionIndex]"
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                v-if="openItems[categoryIndex + '-' + questionIndex]"
                class="px-6 pb-4"
              >
                <div class="border-t border-gray-200 pt-4">
                  <p class="text-gray-600 leading-relaxed">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Still Have Questions?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Can't find the answer you're looking for? We're here to help!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            :href="route('contact')"
            class="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
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
import AOS from 'aos';

onMounted(() => {
  AOS.refresh();
});

const openItems = ref({});

const toggleItem = (index) => {
  openItems.value[index] = !openItems.value[index];
};

const faqs = [
  {
    category: 'General Questions',
    questions: [
      {
        question: 'What is Rich English?',
        answer:
          'Rich English is an online English learning platform that serves Korean and Chinese students. We follow the R.I.C.H. approach: Relevant, Inclusive, Committed, and Hands-on learning experience.',
      },
      {
        question: 'What does R.I.C.H. stand for?',
        answer:
          'R.I.C.H. represents our teaching philosophy: R - Relevant to real-life communication, I - Inclusive of all learners regardless of level or background, C - Committed to delivering excellence in every class, H - Hands-on through practical, interactive, and engaging lessons.',
      },
      {
        question: 'Who can join Rich English?',
        answer:
          'Rich English is designed for Korean and Chinese students who want to improve their English skills. We welcome learners of all levels and backgrounds.',
      },
    ],
  },
  {
    category: 'Class Information',
    questions: [
      {
        question: 'How long are the classes?',
        answer:
          'Class duration varies depending on the course and student needs. Typically, classes range from 25-50 minutes per session.',
      },
      {
        question: 'What platforms are used for classes?',
        answer:
          'We use various online platforms including Zoom, Voov, and other video conferencing tools to conduct our classes.',
      },
      {
        question: 'Are teaching materials provided?',
        answer:
          'Yes, all teaching materials are provided by Rich English. Teachers will have access to our comprehensive curriculum and resources.',
      },
      {
        question: 'Are classes regular?',
        answer:
          'Yes, classes are regular and typically scheduled Monday to Friday. Students can choose their preferred time slots.',
      },
    ],
  },
  {
    category: 'Teacher Information',
    questions: [
      {
        question: "What is a Teacher's Level?",
        answer:
          'Teacher levels indicate experience and expertise. Higher levels correspond to higher teaching rates and more advanced responsibilities.',
      },
      {
        question: 'How can I level up as a teacher?',
        answer:
          'Teachers can level up based on their performance, years of service, student feedback, and completion of additional training programs.',
      },
      {
        question: 'How can teachers earn more?',
        answer:
          'Teachers can increase their earnings through referrals, achieving quarterly teaching awards, improving their teacher level, and maintaining excellent performance ratings.',
      },
      {
        question: 'What are the minimum requirements to become a teacher?',
        answer:
          "Minimum requirements include: 1) A Bachelor's Degree (preferably LPT, Education graduate, English major, or related course), 2) Strong English skills (both oral and written), 3) Ability to multitask, follow instructions, and maintain a positive work attitude.",
      },
    ],
  },
  {
    category: 'Technical Requirements',
    questions: [
      {
        question: 'What are the system requirements for teachers?',
        answer:
          'Teachers need: Desktop or Laptop (Intel i3 or higher/AMD equivalent, Windows 10 or higher, 8GB RAM or more), Fiber optic internet connection (10-50 Mbps), Backup internet connection, Backup power supply (UPS or power station), Webcam (at least 720p), and Headset with noise cancellation.',
      },
      {
        question: 'What should my teaching environment be like?',
        answer:
          'Your teaching environment should be quiet, clutter-free, and well-lit. It should be a professional space that allows you to focus on teaching without distractions.',
      },
      {
        question: 'Do I need backup internet and power?',
        answer:
          'Yes, having backup internet connection and power supply (UPS or power station) is highly recommended to ensure uninterrupted teaching sessions.',
      },
    ],
  },
  {
    category: 'Application Process',
    questions: [
      {
        question: 'How do I apply to become a teacher?',
        answer:
          'To apply: 1) Send your resume/CV, 2) Send a 1-minute self-introduction video (following provided guidelines), 3) Send a screenshot of your internet speed test, 4) Send your laptop/PC specifications, 5) Wait for an email within 1-3 days regarding the next step.',
      },
      {
        question: 'What happens after I submit my application?',
        answer:
          "After submission, you'll go through: Grammar Exam & Interview → Demo Class → Training → Start Teaching. You'll receive an email within 1-3 days about the next step.",
      },
      {
        question: "What if I don't receive a response?",
        answer:
          "If you don't receive a response within the specified timeframe, you may reapply after 7 days.",
      },
    ],
  },
];
</script>
