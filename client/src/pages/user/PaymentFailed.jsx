import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function PaymentFailed() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const canceled = searchParams.get('canceled');

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Error Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-4">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {canceled === 'true' ? 'Payment Canceled' : 'Payment Failed'}
                    </h1>
                    <p className="text-gray-400">
                        {canceled === 'true'
                            ? 'You canceled the payment process'
                            : error || 'Something went wrong with your payment'}
                    </p>
                </div>

                {/* Information Card */}
                <div className="card mb-6">
                    <h3 className="font-semibold mb-3">What happened?</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {canceled === 'true'
                            ? 'Your payment was canceled and no charges were made. Your cart items are still saved.'
                            : 'Your payment could not be processed. Please try again or use a different payment method.'}
                    </p>

                    {!canceled && (
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                            <p className="text-sm text-yellow-500">
                                <strong>Note:</strong> If you were charged, please contact support with transaction details.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/cart')}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={18} />
                        Back to Cart
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </button>
                </div>

                {/* Support Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? <a href="/contact" className="text-purple-500 hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
