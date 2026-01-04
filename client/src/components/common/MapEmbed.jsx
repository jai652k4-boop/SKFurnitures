import { MapPin } from 'lucide-react';

export default function MapEmbed() {


    const mapSrc = import.meta.env.VITE_MAP_EMBED;

    return (
        <div className="card">
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
                    className="btn-primary inline-block mt-3 text-sm"
                >
                    Get Directions
                </a>
            </div>
        </div>
    );
}
