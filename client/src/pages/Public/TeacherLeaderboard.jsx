import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrophyIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const TeacherLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("current");

  // Mock data for demonstration
  const mockLeaderboard = [
    {
      id: 1,
      rank: 1,
      name: "Teacher Mitch",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      totalClasses: 245,
      attendanceRate: 98.5,
      studentFeedback: 4.9,
      responsiveness: 95,
      level: "Senior",
      badge: "Gold",
    },
    {
      id: 2,
      rank: 2,
      name: "Teacher Abigail",
      picture:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      totalClasses: 198,
      attendanceRate: 97.2,
      studentFeedback: 4.8,
      responsiveness: 92,
      level: "Senior",
      badge: "Silver",
    },
    {
      id: 3,
      rank: 3,
      name: "Teacher Shena",
      picture:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      totalClasses: 187,
      attendanceRate: 96.8,
      studentFeedback: 4.7,
      responsiveness: 90,
      level: "Intermediate",
      badge: "Bronze",
    },
    {
      id: 4,
      rank: 4,
      name: "Teacher Via",
      picture:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      totalClasses: 165,
      attendanceRate: 95.5,
      studentFeedback: 4.6,
      responsiveness: 88,
      level: "Intermediate",
      badge: "Bronze",
    },
    {
      id: 5,
      rank: 5,
      name: "Teacher Jenin",
      picture:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      totalClasses: 142,
      attendanceRate: 94.2,
      studentFeedback: 4.5,
      responsiveness: 85,
      level: "Intermediate",
      badge: "Bronze",
    },
    {
      id: 6,
      rank: 6,
      name: "Teacher Giffy",
      picture:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      totalClasses: 128,
      attendanceRate: 93.8,
      studentFeedback: 4.4,
      responsiveness: 82,
      level: "Junior",
      badge: "Bronze",
    },
    {
      id: 7,
      rank: 7,
      name: "Teacher Kristel",
      picture:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
      totalClasses: 115,
      attendanceRate: 92.5,
      studentFeedback: 4.3,
      responsiveness: 80,
      level: "Junior",
      badge: "Bronze",
    },
    {
      id: 8,
      rank: 8,
      name: "Teacher Enya",
      picture:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      totalClasses: 98,
      attendanceRate: 91.2,
      studentFeedback: 4.2,
      responsiveness: 78,
      level: "Junior",
      badge: "Bronze",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 1000);
  }, [selectedMonth]);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Gold":
        return "bg-yellow-500";
      case "Silver":
        return "bg-gray-400";
      case "Bronze":
        return "bg-orange-600";
      default:
        return "bg-gray-300";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Senior":
        return "bg-purple-100 text-purple-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Junior":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-blue-600">Rich English</Link>
              </div>
              <div className="ml-4">
                <span className="text-sm text-gray-500">Where Kindness Leads, English Follows, Growth Lasts</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link to="/apply" className="text-gray-700 hover:text-blue-600">Apply to Teach</Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-600">FAQ</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            🌟 Top 20 Teacher Rankings
          </h1>
          <p
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Celebrating our outstanding teachers who excel in attendance,
            student satisfaction, and teaching excellence.
          </p>
        </div>
      </section>

      {/* Leaderboard Controls */}
      <section className="py-8 bg-white border-b" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0" data-aos="fade-up">
              <h2 className="text-2xl font-bold text-gray-900">
                Monthly Leaderboard
              </h2>
              <p className="text-gray-600">Auto-generated monthly rankings</p>
            </div>
            <div
              className="flex space-x-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current">Current Month</option>
                <option value="previous">Previous Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Criteria Info */}
      <section className="py-8 bg-gray-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3
            className="text-xl font-bold text-gray-900 mb-6 text-center"
            data-aos="fade-up"
          >
            Ranking Criteria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center" data-aos="fade-up" data-aos-delay="50">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Attendance Rate</h4>
              <p className="text-sm text-gray-600">
                Consistency in showing up for classes
              </p>
            </div>
            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="120"
            >
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <StarIcon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Student Reviews</h4>
              <p className="text-sm text-gray-600">
                Average rating from student feedback
              </p>
            </div>
            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="190"
            >
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Class Completion</h4>
              <p className="text-sm text-gray-600">
                Number of successfully completed classes
              </p>
            </div>
            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="260"
            >
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChatBubbleLeftIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Responsiveness</h4>
              <p className="text-sm text-gray-600">
                Communication and engagement quality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="py-12" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            data-aos="fade-up"
          >
            <div className="px-6 py-4 bg-gray-50 border-b" data-aos="fade-up">
              <h3 className="text-lg font-bold text-gray-900">
                Top Teachers This Month
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Classes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsiveness
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-50"
                      data-aos="fade-up"
                      data-aos-delay={teacher.rank * 50}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              teacher.rank <= 3
                                ? getBadgeColor(teacher.badge)
                                : "bg-gray-400"
                            }`}
                          >
                            {teacher.rank <= 3 && (
                              <TrophyIcon className="w-4 h-4" />
                            )}
                            {teacher.rank > 3 && teacher.rank}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            #{teacher.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={teacher.picture}
                            alt={teacher.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {teacher.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                            teacher.level
                          )}`}
                        >
                          {teacher.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.totalClasses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${teacher.attendanceRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">
                            {teacher.attendanceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-900">
                            {teacher.studentFeedback}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${teacher.responsiveness}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">
                            {teacher.responsiveness}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Want to Join Our Top Teachers?
          </h2>
          <p
            className="text-xl text-gray-600 mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Apply today and start your journey to becoming one of our
            top-performing teachers.
          </p>
          <Link
            to="/apply"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Apply to Teach
          </Link>
        </div>
      </section>

      {/* Footer */}

      <Footer />

      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Rich English</h3>
              <p className="text-gray-400">
                Where Kindness Leads, English Follows, Growth Lasts.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/apply" className="hover:text-white">Apply to Teach</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@richenglish.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rich English. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default TeacherLeaderboard;
