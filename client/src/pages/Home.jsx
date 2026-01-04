import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Clock, CreditCard, MapPin, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';

export default function Home() {
    const { isSignedIn } = useAuth();
    const { user } = useSelector(state => state.auth);

    // Redirect based on role
    if (isSignedIn && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }

    const features = [
        { icon: <Package size={24} />, title: 'Wide Selection', desc: 'Browse thousands of quality products' },
        { icon: <CreditCard size={24} />, title: 'Secure Payment', desc: 'Multiple payment options with Stripe' },
        { icon: <MapPin size={24} />, title: 'Fast Delivery', desc: 'Free shipping on orders over ₹999' },
        { icon: <Clock size={24} />, title: 'Order Tracking', desc: 'Track your order status in real-time' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20" />
                <div className="max-w-6xl mx-auto relative">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">Shop</span> Amazing
                            <br />Products
                        </h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#0f766e' }}>
                            Discover our curated collection of quality products,
                            delivered right to your doorstep with care.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            < Link to="/menu" className="btn-primary flex items-center gap-2 text-lg px-8">
                                Browse Products <ArrowRight size={20} />
                            </Link>
                            <Link to="/location" className="btn-secondary flex items-center gap-2 text-lg px-8">
                                <MapPin size={20} /> Find Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Shop With Us?</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card text-center">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto card text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
                    <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
                    <p className="text-gray-600 mb-6">Browse our collection and find your perfect product!</p>
                    <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                        Explore Products <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
