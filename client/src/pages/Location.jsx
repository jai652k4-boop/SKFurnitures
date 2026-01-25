import MapEmbed from '../components/common/MapEmbed';
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';

export default function Location() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Visit Our <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Showroom</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience our premium furniture collection in person. Our experts are ready to help you find the perfect pieces for your space.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Map */}
                <div className="mb-12">
                    <MapEmbed />
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Address */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                            <MapPin className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Address</h3>
                        <p className="text-gray-600 leading-relaxed">
                            SK Furniture<br />
                            Erode, Tamil Nadu<br />
                            India - 638001
                        </p>
                        <a
                            href="https://maps.google.com/?q=Erode,Tamil+Nadu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-gray-700 hover:text-purple-600 transition break-all"
                        >
                            <Navigation size={16} />
                            Get Directions
                        </a>
                    </div>

                    {/* Hours */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                            <Clock className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Business Hours</h3>
                        <div className="space-y-2 text-gray-600">
                            <div className="flex justify-between">
                                <span>Monday - Friday</span>
                                <span className="font-semibold">9 AM - 8 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saturday - Sunday</span>
                                <span className="font-semibold">10 AM - 6 PM</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                                    Open Now
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                            <Phone className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Phone</h3>
                        <p className="text-gray-600 mb-2">
                            Sales & Support
                        </p>
                        <a
                            href="tel:+919876543210"
                            className="text-2xl font-bold text-secondary hover:text-primary transition"
                        >
                            +91 98765 43210
                        </a>
                        <p className="text-sm text-gray-500 mt-3">
                            Call us for inquiries and appointments
                        </p>
                    </div>

                    {/* Email */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                            <Mail className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Email</h3>
                        <p className="text-gray-600 mb-2">
                            Customer Service
                        </p>
                        <a
                            href="mailto:info@skfurniture.com"
                            className="text-lg font-semibold text-secondary hover:text-primary transition break-all"
                        >
                            info@skfurniture.com
                        </a>
                        <p className="text-sm text-gray-500 mt-3">
                            We'll respond within 24 hours
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8 md:p-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Schedule a Showroom Visit
                        </h2>
                        <p className="text-purple-100 text-lg mb-8">
                            Book an appointment with our design experts for a personalized shopping experience
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+919876543210"
                                className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-white text-purple-600 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg active:scale-95 rounded-lg"
                            >
                                <Phone size={20} />
                                Call to Book
                            </a>
                            <a
                                href="mailto:info@skfurniture.com"
                                className="inline-flex items-center gap-2 px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-all active:scale-95"
                            >
                                <Mail size={20} />
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
