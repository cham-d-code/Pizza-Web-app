import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Mail, MapPin } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchUserSubmissions();
  }, [navigate]);

  const fetchUserSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/contact/my-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserSubmissions(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching user submissions:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length > 100) {
      newErrors.subject = 'Subject cannot exceed 100 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message cannot exceed 1000 characters';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid Sri Lankan phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Server returned HTML instead of JSON:', textResponse);
        setErrors({ api: 'Server error. Please try again later.' });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data?.message || 'Failed to submit contact form' });
        return;
      }

      // Success
      setSuccess(true);
      setFormData({
        subject: '',
        message: '',
        contactEmail: '',
        contactPhone: ''
      });
      setErrors({});
      
      // Refresh user submissions
      fetchUserSubmissions();
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (error) {
      console.error('Contact form submission error:', error);
      if (error.message.includes('fetch')) {
        setErrors({ api: 'Cannot connect to server. Please check your connection.' });
      } else {
        setErrors({ api: 'Server error. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-red-50 font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 -z-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/main')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Contact Us</h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <p className="text-green-800 font-medium">
                    Your message has been sent successfully! We'll get back to you soon.
                  </p>
                </div>
              </div>
            )}

            {errors.api && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{errors.api}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="What's this about?"
                  maxLength={100}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${
                    errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="077XXXXXXX or +94XXXXXXXXX"
                />
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us how we can help you..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                  <p className="text-gray-500 text-sm ml-auto">{formData.message.length}/1000</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Previous Submissions */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Phone className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+94 11 234 5678</p>
                    <p className="text-gray-600">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">support@pizzapalace.lk</p>
                    <p className="text-gray-600">orders@pizzapalace.lk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">123 Pizza Street<br />Colombo 03, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Submissions */}
            {userSubmissions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Previous Messages</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userSubmissions.map((submission) => (
                    <div key={submission._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{submission.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{submission.message}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(submission.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {submission.adminResponse && (
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">
                            <strong>Response:</strong> {submission.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;