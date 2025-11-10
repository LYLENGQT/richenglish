import React from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  HandThumbUpIcon,
  StarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
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
              <Link to="/apply" className="text-gray-700 hover:text-blue-600">Apply to Teach</Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-600">FAQ</Link>
              <Link to="/leaderboard" className="text-gray-700 hover:text-blue-600">Leaderboard</Link>
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
            About Rich English
          </h1>
          <p
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Welcome to Rich English — Where Kindness Leads, English Follows,
            Growth Lasts.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              To deliver English learning that's truly{" "}
              <span className="font-bold text-blue-600">R.I.C.H.</span> for
              every Korean and Chinese student:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-aos="zoom-in" data-aos-delay="50">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">R</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relevant</h3>
              <p className="text-gray-600">To real-life communication</p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="150"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">I</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inclusive
              </h3>
              <p className="text-gray-600">
                Of all learners, regardless of level or background
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="250"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">C</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Committed
              </h3>
              <p className="text-gray-600">
                To delivering excellence in every class
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="350"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">H</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hands-on</h3>
              <p className="text-gray-600">
                Through practical, interactive, and engaging lessons
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                To be a place of growth for both teachers and students across
                generations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <HeartIcon className="w-6 h-6 text-red-500 mr-3" />
                  <span className="text-gray-700">
                    Kindness-first approach to learning
                  </span>
                </div>
                <div className="flex items-center">
                  <GlobeAltIcon className="w-6 h-6 text-blue-500 mr-3" />
                  <span className="text-gray-700">
                    Global community of learners
                  </span>
                </div>
                <div className="flex items-center">
                  <AcademicCapIcon className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    Continuous growth and development
                  </span>
                </div>
                <div className="flex items-center">
                  <HandThumbUpIcon className="w-6 h-6 text-purple-500 mr-3" />
                  <span className="text-gray-700">
                    Interactive and engaging lessons
                  </span>
                </div>
              </div>
            </div>

            <div
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose Rich English?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <StarIcon className="w-6 h-6 text-yellow-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Expert Teachers</h4>
                    <p className="text-gray-600">
                      Certified educators with years of experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UsersIcon className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Diverse Community
                    </h4>
                    <p className="text-gray-600">
                      Students from Korea and China learning together
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AcademicCapIcon className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Proven Results</h4>
                    <p className="text-gray-600">
                      Track record of student success and growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div data-aos="fade-up" data-aos-delay="50">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="120">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Expert Teachers</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="190">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="260">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Ready to Start Your English Journey?
          </h2>
          <p
            className="text-xl text-gray-600 mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Join our community of learners and experience the R.I.C.H. approach
            to English learning.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Learning Today
            </Link>
            <Link
              to="/apply"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Apply to Teach
            </Link>
          </div>
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
                <li><Link to="/apply" className="hover:text-white">Apply to Teach</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
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

export default About;
