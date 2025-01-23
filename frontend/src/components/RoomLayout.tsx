import React from 'react';
import { Link, useLocation, useParams, Navigate } from 'react-router-dom';
import { useRoom } from '../contexts/RoomContext';

interface RoomLayoutProps {
    children: React.ReactNode;
}

export const RoomLayout: React.FC<RoomLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { seed } = useParams<{ seed: string }>();
    const { room } = useRoom();

    if (!room || !seed) {
        return <Navigate to="/" replace />;
    }

    const tabs = [
        { name: 'Food', path: `/room/${seed}/food` },
        { name: 'Drinks', path: `/room/${seed}/drinks` },
    ].filter(tab => room.settings?.mealTypes.includes(tab.name));

    if (tabs.length === 0) {
        return <Navigate to="/" replace />;
    }

    // If we're at the room root, redirect to the first available tab
    if (location.pathname === `/room/${seed}`) {
        return <Navigate to={tabs[0].path} replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="border-b border-gray-200 bg-white">
                <div className="max-w-[1920px] mx-auto">
                    <div className="flex h-16 justify-between items-center px-10">
                        <div className="flex">
                            <div className="flex space-x-8">
                                {tabs.map((tab) => {
                                    const isActive = location.pathname === tab.path;
                                    return (
                                        <Link
                                            key={tab.name}
                                            to={tab.path}
                                            className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                                                isActive
                                                    ? 'border-purple-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            {tab.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">Room: {room.seed}</span>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}; 