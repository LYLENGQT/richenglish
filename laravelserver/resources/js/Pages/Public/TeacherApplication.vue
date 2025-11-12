<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" data-aos="fade-up">
          Apply to Teach
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Join our team of expert teachers and help Korean and Chinese students
          master English with our R.I.C.H. approach.
        </p>
      </div>
    </section>

    <!-- Requirements Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Basic Qualifications
          </h2>
          <p class="text-xl text-gray-600">
            Meet our requirements to become a Rich English teacher
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div
            v-for="(req, index) in requirements"
            :key="index"
            class="text-center p-6 border border-gray-200 rounded-lg"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div
              class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                v-if="index === 0"
                class="w-8 h-8 text-blue-600"
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
              <svg
                v-else-if="index === 1"
                class="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <svg
                v-else
                class="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ req.title }}
            </h3>
            <p class="text-gray-600">{{ req.description }}</p>
            <span
              v-if="req.required"
              class="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
            >
              Required
            </span>
          </div>
        </div>

        <!-- System Requirements -->
        <div class="text-center mb-16" data-aos="fade-up">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            System Requirements
          </h3>
          <p class="text-xl text-gray-600 mb-8">
            Ensure you have the right setup for online teaching
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="(req, index) in systemRequirements"
            :key="index"
            class="bg-gray-50 p-6 rounded-lg"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div class="flex items-start">
              <div
                class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              >
                <svg
                  v-if="index === 0"
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <svg
                  v-else-if="index === 1"
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
                <svg
                  v-else-if="index === 2"
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">
                  {{ req.title }}
                </h4>
                <p class="text-gray-600">{{ req.specs }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Form -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-lg p-8" data-aos="fade-up">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Teacher Application Form
            </h2>
            <div class="flex justify-center mb-4">
              <div
                v-for="(step, index) in totalSteps"
                :key="index"
                class="flex items-center"
              >
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    index + 1 <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600',
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <div
                  v-if="index < totalSteps - 1"
                  :class="[
                    'w-16 h-1 mx-2',
                    index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300',
                  ]"
                ></div>
              </div>
            </div>
            <p class="text-gray-600">
              Step {{ currentStep }} of {{ totalSteps }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Step 1: Personal Information -->
            <div v-if="currentStep === 1" class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    v-model="formData.firstName"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    v-model="formData.lastName"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
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
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Educational Background -->
            <div v-if="currentStep === 2" class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                Educational Background
              </h3>
              <div class="space-y-6">
                <div>
                  <label
                    for="degree"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Degree *
                  </label>
                  <select
                    id="degree"
                    v-model="formData.degree"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your degree</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    for="major"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Major/Field of Study *
                  </label>
                  <input
                    type="text"
                    id="major"
                    v-model="formData.major"
                    placeholder="e.g., Education, English, LPT"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    for="englishLevel"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    English Proficiency Level *
                  </label>
                  <select
                    id="englishLevel"
                    v-model="formData.englishLevel"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your English level</option>
                    <option value="Native">Native Speaker</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
                <div>
                  <label
                    for="experience"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teaching Experience *
                  </label>
                  <textarea
                    id="experience"
                    v-model="formData.experience"
                    rows="4"
                    placeholder="Describe your teaching experience, especially with ESL/English teaching"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Step 3: Technical Requirements -->
            <div v-if="currentStep === 3" class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                Technical Requirements
              </h3>
              <div class="space-y-6">
                <div>
                  <label
                    for="internetSpeed"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Internet Speed Test Result *
                  </label>
                  <input
                    type="text"
                    id="internetSpeed"
                    v-model="formData.internetSpeed"
                    placeholder="e.g., 25 Mbps download, 10 Mbps upload"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    for="computerSpecs"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Computer Specifications *
                  </label>
                  <textarea
                    id="computerSpecs"
                    v-model="formData.computerSpecs"
                    rows="3"
                    placeholder="CPU, RAM, OS, etc."
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <label
                    for="teachingEnvironment"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teaching Environment Description *
                  </label>
                  <textarea
                    id="teachingEnvironment"
                    v-model="formData.teachingEnvironment"
                    rows="3"
                    placeholder="Describe your teaching space (quiet, well-lit, clutter-free)"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div class="space-y-4">
                  <h4 class="text-lg font-medium text-gray-900">
                    Equipment Checklist
                  </h4>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.hasWebcam"
                        class="mr-3"
                      />
                      <span>I have a webcam (at least 720p)</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.hasHeadset"
                        class="mr-3"
                      />
                      <span>I have a headset with noise cancellation</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.hasBackupInternet"
                        class="mr-3"
                      />
                      <span>I have backup internet connection</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.hasBackupPower"
                        class="mr-3"
                      />
                      <span>
                        I have backup power supply (UPS/power station)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Additional Information & Files -->
            <div v-if="currentStep === 4" class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                Additional Information & Files
              </h3>
              <div class="space-y-6">
                <div>
                  <label
                    for="motivation"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Why do you want to teach at Rich English? *
                  </label>
                  <textarea
                    id="motivation"
                    v-model="formData.motivation"
                    rows="4"
                    placeholder="Tell us about your motivation and passion for teaching"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <label
                    for="availability"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Availability *
                  </label>
                  <textarea
                    id="availability"
                    v-model="formData.availability"
                    rows="3"
                    placeholder="When are you available to teach? (Monday-Friday preferred)"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div class="space-y-4">
                  <h4 class="text-lg font-medium text-gray-900">
                    Required Documents
                  </h4>
                  <div>
                    <label
                      for="resume"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Resume/CV *
                    </label>
                    <input
                      type="file"
                      id="resume"
                      @change="handleFileChange($event, 'resume')"
                      accept=".pdf,.doc,.docx"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      for="introVideo"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      1-Minute Self-Introduction Video *
                    </label>
                    <input
                      type="file"
                      id="introVideo"
                      @change="handleFileChange($event, 'introVideo')"
                      accept="video/*"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p class="text-sm text-gray-500 mt-1">
                      Please follow the provided guidelines for the video
                    </p>
                  </div>
                  <div>
                    <label
                      for="speedTestScreenshot"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Internet Speed Test Screenshot *
                    </label>
                    <input
                      type="file"
                      id="speedTestScreenshot"
                      @change="handleFileChange($event, 'speedTestScreenshot')"
                      accept="image/*"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-8">
              <button
                type="button"
                @click="prevStep"
                :disabled="currentStep === 1"
                :class="[
                  'px-6 py-3 rounded-lg font-medium',
                  currentStep === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700',
                ]"
              >
                Previous
              </button>

              <button
                v-if="currentStep < totalSteps"
                type="button"
                @click="nextStep"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Next
              </button>
              <button
                v-else
                type="submit"
                :disabled="isSubmitting"
                class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Application Process
          </h2>
          <p class="text-xl text-gray-600">
            Here's what happens after you submit your application
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div
            v-for="(item, index) in processSteps"
            :key="index"
            class="text-center"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div
              class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-xl font-bold text-blue-600">
                {{ item.step }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {{ item.title }}
            </h3>
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
        </div>

        <div class="mt-12 text-center" data-aos="fade-up">
          <div
            class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto"
          >
            <svg
              class="w-8 h-8 text-yellow-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              Important Note
            </h3>
            <p class="text-gray-600">
              You will receive an email within 1-3 days regarding the next
              step. If you do not receive a response, you may reapply after 7
              days.
            </p>
          </div>
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

const currentStep = ref(1);
const totalSteps = 4;
const isSubmitting = ref(false);

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  degree: '',
  major: '',
  englishLevel: '',
  experience: '',
  motivation: '',
  availability: '',
  internetSpeed: '',
  computerSpecs: '',
  hasWebcam: false,
  hasHeadset: false,
  hasBackupInternet: false,
  hasBackupPower: false,
  teachingEnvironment: '',
  resume: null,
  introVideo: null,
  speedTestScreenshot: null,
};

const formData = ref({ ...initialFormState });

const requirements = [
  {
    title: "Bachelor's Degree",
    description:
      'Preferably LPT, Education graduate, English major, or any related course',
    required: true,
  },
  {
    title: 'Strong English Skills',
    description: 'Both oral and written communication abilities',
    required: true,
  },
  {
    title: 'Work Attitude',
    description:
      'Ability to multitask, follow instructions, and maintain a positive work attitude',
    required: true,
  },
];

const systemRequirements = [
  {
    title: 'Desktop or Laptop',
    specs:
      'CPU: Intel i3 or higher / AMD equivalent, OS: Windows 10 or higher, RAM: 8GB or more',
  },
  {
    title: 'Internet Connection',
    specs:
      'Fiber optic connection with 10–50 Mbps, Backup internet in case of outages',
  },
  {
    title: 'Webcam',
    specs: 'At least 720p quality',
  },
  {
    title: 'Headset',
    specs: 'With noise cancellation feature',
  },
];

const processSteps = [
  {
    step: 1,
    title: 'Submit Application',
    description: 'Send your resume, video, and documents',
  },
  {
    step: 2,
    title: 'Grammar Exam & Interview',
    description: 'Test your English skills and interview',
  },
  {
    step: 3,
    title: 'Demo Class',
    description: 'Show your teaching abilities',
  },
  {
    step: 4,
    title: 'Training',
    description: 'Learn our teaching methods',
  },
  {
    step: 5,
    title: 'Start Teaching',
    description: 'Begin your journey with Rich English',
  },
];

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  formData.value[name] = type === 'checkbox' ? checked : value;
};

const handleFileChange = (e, field) => {
  const files = e.target.files;
  if (files && files[0]) {
    formData.value[field] = files[0];
  }
};

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    // Create FormData for file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.value.firstName);
    formDataToSend.append('last_name', formData.value.lastName);
    formDataToSend.append('email', formData.value.email);
    formDataToSend.append('phone', formData.value.phone);
    formDataToSend.append('degree', formData.value.degree);
    formDataToSend.append('major', formData.value.major);
    formDataToSend.append('english_level', formData.value.englishLevel);
    formDataToSend.append('experience', formData.value.experience);
    formDataToSend.append('motivation', formData.value.motivation);
    formDataToSend.append('availability', formData.value.availability);
    formDataToSend.append('internet_speed', formData.value.internetSpeed);
    formDataToSend.append('computer_specs', formData.value.computerSpecs);
    formDataToSend.append('has_webcam', formData.value.hasWebcam ? '1' : '0');
    formDataToSend.append('has_headset', formData.value.hasHeadset ? '1' : '0');
    formDataToSend.append(
      'has_backup_internet',
      formData.value.hasBackupInternet ? '1' : '0'
    );
    formDataToSend.append(
      'has_backup_power',
      formData.value.hasBackupPower ? '1' : '0'
    );
    formDataToSend.append(
      'teaching_environment',
      formData.value.teachingEnvironment
    );

    if (formData.value.resume) {
      formDataToSend.append('resume', formData.value.resume);
    }
    if (formData.value.introVideo) {
      formDataToSend.append('intro_video', formData.value.introVideo);
    }
    if (formData.value.speedTestScreenshot) {
      formDataToSend.append(
        'speed_test_screenshot',
        formData.value.speedTestScreenshot
      );
    }

    const response = await api.post('/teacher-applications', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert(
      response.data.message ||
        'Application submitted successfully! You will receive an email within 1-3 days regarding the next step.'
    );
    currentStep.value = 1;
    formData.value = { ...initialFormState };
  } catch (error) {
    console.error('Teacher application error:', error);
    const errorMessage =
      error.response?.data?.message ||
      'Failed to submit application. Please try again later.';
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
