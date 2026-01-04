import MapEmbed from '../components/common/MapEmbed';

export default function Location() {
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Find <span className="gradient-text">Us</span></h1>
                    <p className="text-gray-600">Visit our showroom to see our furniture collection</p>
                </div>

                <MapEmbed />

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="card">
                        <h3 className="font-semibold text-lg mb-3">📍 Address</h3>
                        <p className="text-gray-600">
                            SK Furnitures<br />
                            Erode, Tamil Nadu<br />
                            India
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="font-semibold text-lg mb-3">🕐 Hours</h3>
                        <p className="text-gray-600">
                            Monday - Sunday<br />
                            7:00 AM - 10:00 PM<br />
                            <span className="text-green-400">Open Now</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
