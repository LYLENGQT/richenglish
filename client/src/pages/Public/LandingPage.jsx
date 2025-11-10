import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  CheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teacher-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error?.msg || "Failed to submit application. Please try again later."
        );
      }

      setFormData({ name: "", email: "", phone: "", message: "" });
      alert("Application submitted! Our team will review and reach out soon.");
    } catch (error) {
      console.error("Application error:", error);
      alert(
        error.message || "Failed to submit application. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

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
            Transform Lives Through English
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join Rich English as a teacher and make a difference in students'
            lives with our R.I.C.H. approach
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Link
              to="/apply"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* R.I.C.H. Approach Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our R.I.C.H. Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in a holistic approach to English education that goes
              beyond just language learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-aos="zoom-in" data-aos-delay="50">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Respect
              </h3>
              <p className="text-gray-600">
                We respect every student's unique learning journey and cultural
                background
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="150"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integrity
              </h3>
              <p className="text-gray-600">
                We maintain the highest standards of honesty and professionalism
                in all our interactions
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="250"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Commitment
              </h3>
              <p className="text-gray-600">
                We are committed to providing consistent, high-quality education
                and support
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="350"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hope</h3>
              <p className="text-gray-600">
                We inspire hope and confidence in our students' ability to
                achieve their dreams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join Rich English?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a community that values growth, learning, and making a
              positive impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <div className="flex items-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Competitive Pay
                </h3>
              </div>
              <p className="text-gray-600">
                We offer competitive compensation packages that recognize your
                expertise and dedication
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="120"
            >
              <div className="flex items-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Flexible Schedule
                </h3>
              </div>
              <p className="text-gray-600">
                Work with a schedule that fits your lifestyle and personal
                commitments
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="190"
            >
              <div className="flex items-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Professional Development
                </h3>
              </div>
              <p className="text-gray-600">
                Access to ongoing training and development opportunities to
                enhance your skills
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="260"
            >
              <div className="flex items-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Supportive Community
                </h3>
              </div>
              <p className="text-gray-600">
                Join a community of passionate educators who support and inspire
                each other
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="330"
            >
              <div className="flex items-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Modern Technology
                </h3>
              </div>
              <p className="text-gray-600">
                Access to cutting-edge teaching tools and platforms to enhance
                your lessons
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="flex items-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Make a Difference
                </h3>
              </div>
              <p className="text-gray-600">
                Help students achieve their dreams and make a lasting impact on
                their lives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Teachers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our amazing teachers about their experience with Rich
              English
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Teaching with Rich English has been incredibly rewarding. The
                support and resources provided are outstanding."
              </p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-500">
                English Teacher, 3 years
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The R.I.C.H. approach really works. I've seen my students grow
                not just in English, but in confidence too."
              </p>
              <div className="font-semibold text-gray-900">Michael Chen</div>
              <div className="text-sm text-gray-500">
                English Teacher, 2 years
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The flexible schedule allows me to balance work and family
                perfectly. Highly recommended!"
              </p>
              <div className="font-semibold text-gray-900">Emily Rodriguez</div>
              <div className="text-sm text-gray-500">
                English Teacher, 4 years
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            Ready to Make a Difference?
          </h2>
          <p
            className="text-xl mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Join our community of passionate educators and help students achieve
            their English learning goals
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="250"
          >
            <Link
              to="/apply"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Application
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto" data-aos="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Have questions? We'd love to hear from you
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div data-aos="fade-up" data-aos-delay="150">
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="200">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="250">
                <label htmlFor="phone" className="label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="300">
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div
                className="text-center"
                data-aos="fade-up"
                data-aos-delay="350"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}

      <Footer />

      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Rich English</h3>
              <p className="text-gray-400">
                Where Kindness Leads, English Follows, Growth Lasts
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/apply" className="text-gray-400 hover:text-white transition-colors">Apply</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Teachers</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-400 mb-2">Email: info@richenglish.com</p>
              <p className="text-gray-400 mb-2">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-400">Address: 123 Education St, Learning City, LC 12345</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Rich English. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default LandingPage;
