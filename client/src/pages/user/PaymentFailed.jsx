import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart, HelpCircle, Mail } from 'lucide-react';

export default function PaymentFailed() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const canceled = searchParams.get('canceled');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-gray-50 py-12 px-4">
            <div className="max-w-2xl w-full">
                {/* Error Animation */}
                <div className="text-center mb-8 animate-scale-up">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
                            <XCircle className="w-14 h-14 text-white" strokeWidth={3} />
                        </div>
                        {/* Decorative shake effect */}
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-red-300 animate-ping"></div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {canceled === 'true' ? 'Payment Canceled' : 'Payment Failed'}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {canceled === 'true'
                            ? 'You canceled the payment process'
                            : 'We couldn\'t process your payment'}
                    </p>
                </div>

                {/* Information Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 shadow-xl mb-6 animate-[fadeIn_0.5s_ease-in]">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900">What happened?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {canceled === 'true'
                                    ? 'Your payment was canceled and no charges were made. Your cart items are still saved and ready for checkout whenever you\'re ready.'
                                    : error || 'There was an issue processing your payment. This could be due to insufficient funds, card issues, or technical problems. Please try again or use a different payment method.'}
                            </p>
                        </div>
                    </div>

                    {!canceled && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex items-start gap-3">
                            <Mail className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Important Note</p>
                                <p className="text-sm text-gray-700">
                                    If you were charged but didn't receive confirmation, please contact our support team with your transaction details. We'll resolve this immediately.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Common Issues */}
                {!canceled && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-gray-900 mb-4">Common Payment Issues</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-secondary mt-1">•</span>
                                <span>Insufficient funds in your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary mt-1">•</span>
                                <span>Incorrect card details or expired card</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary mt-1">•</span>
                                <span>Bank security restrictions or daily limits</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary mt-1">•</span>
                                <span>Temporary network or connection issues</span>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => navigate('/cart')}
                        className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 justify-center"
                    >
                        <ShoppingCart size={18} />
                        Return to Cart
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95 justify-center"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </button>
                </div>

                {/* Support Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
                    <h3 className="font-bold text-gray-900 mb-2">Need Assistance?</h3>
                    <p className="text-gray-600 mb-4">
                        Our support team is here to help resolve any payment issues
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:support@skfurniture.com"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95 justify-center"
                        >
                            <Mail size={16} />
                            Email Support
                        </a>
                        <a
                            href="tel:+919876543210"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95 justify-center"
                        >
                            📞 Call Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
