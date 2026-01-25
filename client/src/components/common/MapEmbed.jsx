import { MapPin } from 'lucide-react';

export default function MapEmbed() {


    const mapSrc = import.meta.env.VITE_MAP_EMBED;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-purple-400" size={24} />
                <h3 className="text-xl font-semibold">Our Location</h3>
            </div>

            <div className="rounded-lg overflow-hidden">
                <iframe
                    src={mapSrc}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sri Velu Mess Location"
                />
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h4 className="font-medium mb-2">Sri Velu Mess</h4>
                <p className="text-gray-400 text-sm">
                    Erode, Tamil Nadu, India<br />
                    Open: 7:00 AM - 10:00 PM
                </p>
                <a
                    href="https://maps.google.com/?q=Sri+Velu+mess"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 inline-block mt-3"
                >
                    Get Directions
                </a>
            </div>
        </div>
    );
}
