import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ComputerDesktopIcon,
  WifiIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TeacherApplication = () => {
  const [formData, setFormData] = useState({
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
    speedTestScreenshot: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
    alert('Application submitted successfully! You will receive an email within 1-3 days regarding the next step.');
  };

  const requirements = [
    {
      icon: AcademicCapIcon,
      title: "Bachelor's Degree",
      description: "Preferably LPT, Education graduate, English major, or any related course",
      required: true
    },
    {
      icon: ComputerDesktopIcon,
      title: "Strong English Skills",
      description: "Both oral and written communication abilities",
      required: true
    },
    {
      icon: CheckCircleIcon,
      title: "Work Attitude",
      description: "Ability to multitask, follow instructions, and maintain a positive work attitude",
      required: true
    }
  ];

  const systemRequirements = [
    {
      icon: ComputerDesktopIcon,
      title: "Desktop or Laptop",
      specs: "CPU: Intel i3 or higher / AMD equivalent, OS: Windows 10 or higher, RAM: 8GB or more"
    },
    {
      icon: WifiIcon,
      title: "Internet Connection",
      specs: "Fiber optic connection with 10–50 Mbps, Backup internet in case of outages"
    },
    {
      icon: VideoCameraIcon,
      title: "Webcam",
      specs: "At least 720p quality"
    },
    {
      icon: SpeakerWaveIcon,
      title: "Headset",
      specs: "With noise cancellation feature"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Apply to Teach
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join our team of expert teachers and help Korean and Chinese students master English with our R.I.C.H. approach.
          </p>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Basic Qualifications
            </h2>
            <p className="text-xl text-gray-600">
              Meet our requirements to become a Rich English teacher
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {requirements.map((req, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <req.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{req.title}</h3>
                <p className="text-gray-600">{req.description}</p>
                {req.required && (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                    Required
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* System Requirements */}
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              System Requirements
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Ensure you have the right setup for online teaching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {systemRequirements.map((req, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <req.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{req.title}</h4>
                    <p className="text-gray-600">{req.specs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Teacher Application Form
              </h2>
              <div className="flex justify-center mb-4">
                {[...Array(totalSteps)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < totalSteps - 1 && (
                      <div className={`w-16 h-1 mx-2 ${
                        index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Educational Background */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Educational Background</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                      <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select your degree</option>
                        <option value="Bachelor">Bachelor's Degree</option>
                        <option value="Master">Master's Degree</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Major/Field of Study *</label>
                      <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        placeholder="e.g., Education, English, LPT"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">English Proficiency Level *</label>
                      <select
                        name="englishLevel"
                        value={formData.englishLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select your English level</option>
                        <option value="Native">Native Speaker</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Experience *</label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe your teaching experience, especially with ESL/English teaching"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Technical Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Requirements</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Internet Speed Test Result *</label>
                      <input
                        type="text"
                        name="internetSpeed"
                        value={formData.internetSpeed}
                        onChange={handleInputChange}
                        placeholder="e.g., 25 Mbps download, 10 Mbps upload"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Computer Specifications *</label>
                      <textarea
                        name="computerSpecs"
                        value={formData.computerSpecs}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="CPU, RAM, OS, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Environment Description *</label>
                      <textarea
                        name="teachingEnvironment"
                        value={formData.teachingEnvironment}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Describe your teaching space (quiet, well-lit, clutter-free)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Equipment Checklist</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="hasWebcam"
                            checked={formData.hasWebcam}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <span>I have a webcam (at least 720p)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="hasHeadset"
                            checked={formData.hasHeadset}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <span>I have a headset with noise cancellation</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="hasBackupInternet"
                            checked={formData.hasBackupInternet}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <span>I have backup internet connection</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="hasBackupPower"
                            checked={formData.hasBackupPower}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <span>I have backup power supply (UPS/power station)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Information & Files */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Information & Files</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to teach at Rich English? *</label>
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your motivation and passion for teaching"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                      <textarea
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="When are you available to teach? (Monday-Friday preferred)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Required Documents</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                        <input
                          type="file"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">1-Minute Self-Introduction Video *</label>
                        <input
                          type="file"
                          name="introVideo"
                          onChange={handleFileChange}
                          accept="video/*"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">Please follow the provided guidelines for the video</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Internet Speed Test Screenshot *</label>
                        <input
                          type="file"
                          name="speedTestScreenshot"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    currentStep === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application Process
            </h2>
            <p className="text-xl text-gray-600">
              Here's what happens after you submit your application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: 1, title: "Submit Application", description: "Send your resume, video, and documents" },
              { step: 2, title: "Grammar Exam & Interview", description: "Test your English skills and interview" },
              { step: 3, title: "Demo Class", description: "Show your teaching abilities" },
              { step: 4, title: "Training", description: "Learn our teaching methods" },
              { step: 5, title: "Start Teaching", description: "Begin your journey with Rich English" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Important Note</h3>
              <p className="text-gray-600">
                You will receive an email within 1-3 days regarding the next step. 
                If you do not receive a response, you may reapply after 7 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
      </footer>
    </div>
  );
};

export default TeacherApplication;
