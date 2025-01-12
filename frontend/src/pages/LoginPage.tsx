import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomSettings } from '../types';
import { createRoom, activateRoom, getRoom } from '../services/api';
import toast from 'react-hot-toast';
import { useRoom } from '../contexts/RoomContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setRoom } = useRoom();
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [newFamily, setNewFamily] = useState('');
    const [families, setFamilies] = useState<string[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [roomSettings, setRoomSettings] = useState<RoomSettings>({
        participantCount: 0,
        mealCount: 0,
        language: 'UK',
        families: [],
        mealType: 'default'
    });

    useEffect(() => {
        // Clear room context when LoginPage mounts
        setRoom(null);
    }, [setRoom]);

    const handleCopyToClipboard = async () => {
        await navigator.clipboard.writeText(roomId);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await getRoom(roomId);
            setRoom(response.data);
            navigate(`/room/${roomId}`);
        } catch (error) {
            console.error('Error joining room:', error);
            toast.error('Failed to join room. Please check the room code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            if (!showCreateRoom) {
                // First click - create room and show settings
                const response = await createRoom();
                setRoomId(response.data.seed);
                setShowCreateRoom(true);
            } else {
                // Second click - activate room with settings
                const response = await activateRoom(roomId, roomSettings);
                setRoom(response.data);
                navigate(`/room/${roomId}`);
            }
        } catch (error) {
            console.error('Error creating/activating room:', error);
            toast.error('Failed to create room. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFamily = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newFamily.trim()) {
            e.preventDefault();
            if (!families.includes(newFamily.trim())) {
                setFamilies(prev => [...prev, newFamily.trim()]);
                setRoomSettings(prev => ({
                    ...prev,
                    families: [...prev.families, newFamily.trim()]
                }));
            }
            setNewFamily('');
        }
    };

    const handleRemoveFamily = (familyToRemove: string) => {
        setFamilies(prev => prev.filter(family => family !== familyToRemove));
        setRoomSettings(prev => ({
            ...prev,
            families: prev.families.filter(family => family !== familyToRemove)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            {showToast && (
                <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500 ease-in-out flex items-center space-x-2">
                    <span>Copied to clipboard. Share! 🎊</span>
                </div>
            )}
            <div className="relative py-3 mx-auto" style={{ width: '35%', maxWidth: '450px', minWidth: '350px' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-emerald-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-6 py-12 bg-white shadow-lg sm:rounded-3xl sm:p-12">
                    <div className="w-full mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Easter Planner</h1>
                                
                                {!showCreateRoom ? (
                                    <div className="space-y-4">
                                        <form onSubmit={handleJoinRoom} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Room Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={roomId}
                                                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm placeholder:text-gray-400 placeholder:text-sm"
                                                    placeholder="Enter room code"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Joining...' : 'Join Room'}
                                            </button>
                                        </form>
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">or</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleCreateRoom}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Creating...' : 'Create New Room'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <form onSubmit={handleCreateRoom} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Room Code
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={roomId}
                                                        readOnly
                                                        className="flex-1 px-4 py-2.5 bg-emerald-50 border border-emerald-300 rounded-md shadow-sm text-sm text-emerald-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleCopyToClipboard}
                                                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center justify-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Number of Participants
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={roomSettings.participantCount || ''}
                                                    onChange={(e) => setRoomSettings(prev => ({
                                                        ...prev,
                                                        participantCount: parseInt(e.target.value) || 0
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Number of Meals
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={roomSettings.mealCount || ''}
                                                    onChange={(e) => setRoomSettings(prev => ({
                                                        ...prev,
                                                        mealCount: parseInt(e.target.value) || 0
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Families Coming (optional)
                                                </label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={newFamily}
                                                        onChange={(e) => setNewFamily(e.target.value)}
                                                        onKeyDown={handleAddFamily}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm placeholder:text-gray-400 placeholder:text-sm"
                                                        placeholder="Type family name and press Enter"
                                                        disabled={isLoading}
                                                    />
                                                    {families.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {families.map((family, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                                                >
                                                                    {family}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveFamily(family)}
                                                                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-900 focus:outline-none"
                                                                        disabled={isLoading}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Meal Type
                                                </label>
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="default"
                                                            name="mealType"
                                                            value="default"
                                                            checked={roomSettings.mealType === 'default'}
                                                            onChange={(e) => setRoomSettings(prev => ({
                                                                ...prev,
                                                                mealType: e.target.value as 'default' | 'large' | 'drinks'
                                                            }))}
                                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                                            disabled={isLoading}
                                                        />
                                                        <label htmlFor="default" className="ml-2 block text-sm text-gray-700">
                                                            Default (Entree, Main Course, Desert)
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="large"
                                                            name="mealType"
                                                            value="large"
                                                            checked={roomSettings.mealType === 'large'}
                                                            onChange={(e) => setRoomSettings(prev => ({
                                                                ...prev,
                                                                mealType: e.target.value as 'default' | 'large' | 'drinks'
                                                            }))}
                                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                                            disabled={isLoading}
                                                        />
                                                        <label htmlFor="large" className="ml-2 block text-sm text-gray-700">
                                                            Large (2 Main Courses)
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="drinks"
                                                            name="mealType"
                                                            value="drinks"
                                                            checked={roomSettings.mealType === 'drinks'}
                                                            onChange={(e) => setRoomSettings(prev => ({
                                                                ...prev,
                                                                mealType: e.target.value as 'default' | 'large' | 'drinks'
                                                            }))}
                                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                                            disabled={isLoading}
                                                        />
                                                        <label htmlFor="drinks" className="ml-2 block text-sm text-gray-700">
                                                            Just Drinks
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Language
                                                </label>
                                                <div className="flex gap-4 justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRoomSettings(prev => ({ ...prev, language: 'UK' }))}
                                                        className={`p-2 border rounded-md flex items-center justify-center ${
                                                            roomSettings.language === 'UK' 
                                                            ? 'border-purple-500 bg-purple-50' 
                                                            : 'border-gray-300'
                                                        }`}
                                                        aria-label="English"
                                                        disabled={isLoading}
                                                    >
                                                        <img 
                                                            src="https://flagcdn.com/gb.svg" 
                                                            alt="UK Flag"
                                                            className="w-8 h-6 object-cover"
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRoomSettings(prev => ({ ...prev, language: 'RO' }))}
                                                        className={`p-2 border rounded-md flex items-center justify-center ${
                                                            roomSettings.language === 'RO' 
                                                            ? 'border-purple-500 bg-purple-50' 
                                                            : 'border-gray-300'
                                                        }`}
                                                        aria-label="Romanian"
                                                        disabled={isLoading}
                                                    >
                                                        <img 
                                                            src="https://flagcdn.com/ro.svg" 
                                                            alt="Romanian Flag"
                                                            className="w-8 h-6 object-cover"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCreateRoom(false)}
                                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Creating...' : 'Create Room'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 