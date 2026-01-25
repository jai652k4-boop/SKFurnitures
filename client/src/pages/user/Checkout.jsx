import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/orderSlice';
import { calculateTotals, clearCart } from '../../store/slices/cartSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Plus } from 'lucide-react';

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, subtotal, deliveryCharge } = useSelector(state => state.cart);
    const [paymentType, setPaymentType] = useState('full');
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    // Track confirmed sessions to prevent duplicate processing
    const confirmedSessionRef = useRef(null);

    useEffect(() => {
        dispatch(calculateTotals());
        fetchAddresses();
    }, [dispatch]);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/addresses');
            if (data.success) {
                setSavedAddresses(data.data || []);
                if (data.data && data.data.length > 0) {
                    setSelectedAddressId(data.data[0]._id);
                }
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
        }
    };

    const handleSaveNewAddress = async () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.street ||
            !newAddress.city || !newAddress.state || !newAddress.pincode) {
            toast.error('Please fill all address fields');
            return;
        }

        try {
            const { data } = await api.post('/addresses', newAddress);
            if (data.success) {
                toast.success('Address saved!');
                await fetchAddresses();
                setShowAddressForm(false);
                setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
                setSelectedAddressId(data.data._id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save address');
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const success = urlParams.get('success');
        const canceled = urlParams.get('canceled');

        // Prevent duplicate processing - check if we already confirmed this session
        if (success === 'true' && sessionId && confirmedSessionRef.current !== sessionId) {
            confirmedSessionRef.current = sessionId;

            const confirmPayment = async () => {
                try {
                    await api.post('/payments/confirm-session', { sessionId });
                    dispatch(clearCart());
                    navigate(`/payment-success?session_id=${sessionId}`);
                } catch (err) {
                    console.error('Error confirming payment:', err);
                    navigate(`/payment-failed?error=${encodeURIComponent(err.message)}`);
                }
            };
            confirmPayment();
        } else if (canceled === 'true') {
            navigate('/payment-failed?canceled=true');
        }
    }, [navigate, dispatch]);

    const handleCheckout = async () => {
        if (loading) return;

        if (items.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }

        if (!selectedAddressId) {
            toast.error('Please select a delivery address');
            return;
        }

        console.log('🔵 [CHECKOUT] Starting checkout...');
        setLoading(true);

        try {
            // Prepare order data (don't create order yet - payment will create it)
            const orderData = {
                items: items.map(i => ({ product: i.productId, quantity: i.quantity })),
                shippingAddressId: selectedAddressId
            };

            console.log('💳 [CHECKOUT] Creating Stripe session with order data...');

            // Send order data to payment endpoint (order created after payment succeeds)
            const { data } = await api.post('/payments/create-payment-intent', {
                orderData,
                paymentType
            });

            console.log('✅ [CHECKOUT] Redirecting to Stripe...');
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('💥 [CHECKOUT] Error:', err);
            toast.error(err.response?.data?.message || 'Checkout failed');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const advanceAmount = Math.ceil(totalAmount / 2);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    {/* Order Summary */}
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                        {items.map(item => (
                            <div key={item.productId} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-md font-semibold">Delivery Address</h3>
                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
                            >
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        {/* Saved Addresses */}
                        {savedAddresses.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {savedAddresses.map(addr => (
                                    <label
                                        key={addr._id}
                                        className={`flex items-start p-3 border rounded-lg cursor-pointer hover:bg-white/5 transition ${selectedAddressId === addr._id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr._id}
                                            checked={selectedAddressId === addr._id}
                                            onChange={() => setSelectedAddressId(addr._id)}
                                            className="mr-3 mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">{addr.name}</div>
                                            <div className="text-sm text-gray-400">{addr.phone}</div>
                                            <div className="text-sm text-gray-400">
                                                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* New Address Form */}
                        {showAddressForm && (
                            <div className="border border-gray-700 rounded-lg p-4 mb-4">
                                <h4 className="font-medium mb-3">Add New Address</h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        className="input"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone *"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        className="input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Street Address *"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        className="input md:col-span-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="City *"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State *"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        className="input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="PIN Code *"
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={handleSaveNewAddress} className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
                                        Save Address
                                    </button>
                                    <button
                                        onClick={() => setShowAddressForm(false)}
                                        className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Options */}
                    <div className="mb-6">
                        <h3 className="text-md font-semibold mb-3">Payment Option</h3>
                        <div className="space-y-2">
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white/5 ${paymentType === 'full' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'
                                }`}>
                                <input
                                    type="radio"
                                    value="full"
                                    checked={paymentType === 'full'}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">Pay Full Amount</div>
                                    <div className="text-sm text-gray-400">Pay ₹{totalAmount} now</div>
                                </div>
                            </label>
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white/5 ${paymentType === 'advance' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'
                                }`}>
                                <input
                                    type="radio"
                                    value="advance"
                                    checked={paymentType === 'advance'}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">Pay 50% Advance</div>
                                    <div className="text-sm text-gray-400">Pay ₹{advanceAmount} now, ₹{totalAmount - advanceAmount} on delivery</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-gray-700 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Delivery</span>
                            <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-purple-400">
                            <span>Pay Now ({paymentType === 'full' ? '100%' : '50%'})</span>
                            <span>₹{paymentType === 'full' ? totalAmount : advanceAmount}</span>
                        </div>
                        {paymentType === 'advance' && (
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Pay on Delivery</span>
                                <span>₹{totalAmount - advanceAmount}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || !selectedAddressId}
                        className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard size={18} />
                                Proceed to Payment
                            </>
                        )}
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-4">
                        🔒 Secure payment powered by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
