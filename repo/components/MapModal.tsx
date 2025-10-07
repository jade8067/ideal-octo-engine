import React from 'react';
import { Icon } from './Icon';

interface MapModalProps {
    location: string;
    onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ location, onClose }) => {
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&hl=zh-TW`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-800">
                        地圖位置: {location}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <Icon name="close" className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex-grow p-2">
                     <iframe
                        title="Task Location Map"
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        className="rounded-b-lg"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};
