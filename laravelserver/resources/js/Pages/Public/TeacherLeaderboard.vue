<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" data-aos="fade-up">
          🌟 Top 20 Teacher Rankings
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Celebrating our outstanding teachers who excel in attendance, student
          satisfaction, and teaching excellence.
        </p>
      </div>
    </section>

    <!-- Leaderboard Controls -->
    <section class="py-8 bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div class="mb-4 sm:mb-0" data-aos="fade-up">
            <h2 class="text-2xl font-bold text-gray-900">
              Monthly Leaderboard
            </h2>
            <p class="text-gray-600">Auto-generated monthly rankings</p>
          </div>
          <div class="flex space-x-4" data-aos="fade-up" data-aos-delay="100">
            <select
              v-model="selectedMonth"
              @change="loadLeaderboard"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="current">Current Month</option>
              <option value="previous">Previous Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Criteria Info -->
    <section class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6 text-center" data-aos="fade-up">
          Ranking Criteria
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center" data-aos="fade-up" data-aos-delay="50">
            <div
              class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-blue-600"
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
            <h4 class="font-bold text-gray-900 mb-2">Attendance Rate</h4>
            <p class="text-sm text-gray-600">
              Consistency in showing up for classes
            </p>
          </div>
          <div class="text-center" data-aos="fade-up" data-aos-delay="120">
            <div
              class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <h4 class="font-bold text-gray-900 mb-2">Student Reviews</h4>
            <p class="text-sm text-gray-600">
              Average rating from student feedback
            </p>
          </div>
          <div class="text-center" data-aos="fade-up" data-aos-delay="190">
            <div
              class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-purple-600"
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
            <h4 class="font-bold text-gray-900 mb-2">Class Completion</h4>
            <p class="text-sm text-gray-600">
              Number of successfully completed classes
            </p>
          </div>
          <div class="text-center" data-aos="fade-up" data-aos-delay="260">
            <div
              class="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-orange-600"
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
            </div>
            <h4 class="font-bold text-gray-900 mb-2">Responsiveness</h4>
            <p class="text-sm text-gray-600">
              Communication and engagement quality
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Leaderboard Table -->
    <section v-else class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <h3 class="text-lg font-bold text-gray-900">
              Top Teachers This Month
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rank
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teacher
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Level
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Classes
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attendance
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student Rating
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Responsiveness
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(teacher, index) in leaderboard"
                  :key="teacher.id"
                  class="hover:bg-gray-50"
                  :data-aos="'fade-up'"
                  :data-aos-delay="index * 50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        :class="[
                          'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
                          teacher.rank <= 3
                            ? getBadgeColor(teacher.badge)
                            : 'bg-gray-400',
                        ]"
                      >
                        <svg
                          v-if="teacher.rank <= 3"
                          class="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                        <span v-else>{{ teacher.rank }}</span>
                      </div>
                      <span class="ml-2 text-sm font-medium text-gray-900">
                        #{{ teacher.rank }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img
                        class="h-10 w-10 rounded-full"
                        :src="teacher.picture || '/default-avatar.png'"
                        :alt="teacher.name"
                      />
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ teacher.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getLevelColor(teacher.level),
                      ]"
                    >
                      {{ teacher.level }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ teacher.totalClasses }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="bg-green-500 h-2 rounded-full"
                          :style="{ width: `${teacher.attendanceRate}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-900">
                        {{ teacher.attendanceRate }}%
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg
                        class="w-4 h-4 text-yellow-400 fill-current mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      <span class="text-sm text-gray-900">
                        {{ teacher.studentFeedback }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="bg-blue-500 h-2 rounded-full"
                          :style="{ width: `${teacher.responsiveness}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-900">
                        {{ teacher.responsiveness }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6" data-aos="fade-up">
          Want to Join Our Top Teachers?
        </h2>
        <p class="text-xl text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">
          Apply today and start your journey to becoming one of our
          top-performing teachers.
        </p>
        <Link
          :href="route('teacher-application')"
          class="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Apply to Teach
        </Link>
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
  loadLeaderboard();
});

const leaderboard = ref([]);
const loading = ref(true);
const selectedMonth = ref('current');

// Mock data for fallback
const mockLeaderboard = [
  {
    id: 1,
    rank: 1,
    name: 'Teacher Mitch',
    picture:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    totalClasses: 245,
    attendanceRate: 98.5,
    studentFeedback: 4.9,
    responsiveness: 95,
    level: 'Senior',
    badge: 'Gold',
  },
  {
    id: 2,
    rank: 2,
    name: 'Teacher Abigail',
    picture:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    totalClasses: 198,
    attendanceRate: 97.2,
    studentFeedback: 4.8,
    responsiveness: 92,
    level: 'Senior',
    badge: 'Silver',
  },
  {
    id: 3,
    rank: 3,
    name: 'Teacher Shena',
    picture:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    totalClasses: 187,
    attendanceRate: 96.8,
    studentFeedback: 4.7,
    responsiveness: 90,
    level: 'Intermediate',
    badge: 'Bronze',
  },
  {
    id: 4,
    rank: 4,
    name: 'Teacher Via',
    picture:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    totalClasses: 165,
    attendanceRate: 95.5,
    studentFeedback: 4.6,
    responsiveness: 88,
    level: 'Intermediate',
    badge: 'Bronze',
  },
  {
    id: 5,
    rank: 5,
    name: 'Teacher Jenin',
    picture:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    totalClasses: 142,
    attendanceRate: 94.2,
    studentFeedback: 4.5,
    responsiveness: 85,
    level: 'Intermediate',
    badge: 'Bronze',
  },
];

const getBadgeColor = (badge) => {
  switch (badge) {
    case 'Gold':
      return 'bg-yellow-500';
    case 'Silver':
      return 'bg-gray-400';
    case 'Bronze':
      return 'bg-orange-600';
    default:
      return 'bg-gray-300';
  }
};

const getLevelColor = (level) => {
  switch (level) {
    case 'Senior':
      return 'bg-purple-100 text-purple-800';
    case 'Intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'Junior':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const loadLeaderboard = async () => {
  try {
    loading.value = true;
    const response = await api.get('/leaderboard', {
      params: { period: selectedMonth.value },
    });
    leaderboard.value = response.data.data || response.data || mockLeaderboard;
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    // Fallback to mock data
    leaderboard.value = mockLeaderboard;
  } finally {
    loading.value = false;
  }
};

</script>
