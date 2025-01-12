import React, { useState } from 'react';
import { WishlistItem } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRoom } from '../contexts/RoomContext';

interface WishlistFormProps {
    onSubmit: (wish: Omit<WishlistItem, 'id'>) => void;
    onOpenModal: () => void;
    onCloseModal: () => void;
}

export const WishlistForm: React.FC<WishlistFormProps> = ({ onSubmit, onOpenModal, onCloseModal }) => {
    const { room } = useRoom();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        dish_name: '',
        requested_quantity: 0,
        notes: '',
        room_id: room?.id || 0,
    });

    const handleOpen = () => {
        setIsFormOpen(true);
        onOpenModal();
    };

    const handleClose = () => {
        setIsFormOpen(false);
        onCloseModal();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!room?.id) return;
        
        const wishData = {
            ...formData,
            room_id: room.id
        };
        onSubmit(wishData);
        setFormData({ dish_name: '', requested_quantity: 0, notes: '', room_id: room.id });
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isFormOpen) {
        return (
            <button
                onClick={handleOpen}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg 
                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-purple-500 shadow-sm transition-colors gap-2"
            >
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Add Wish</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 text-center">
                        Add a Wish to the List
                    </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="dish_name" className="block text-sm font-medium text-gray-700 mb-2">
                                What dish would you like someone to bring?
                            </label>
                            <textarea
                                id="dish_name"
                                name="dish_name"
                                value={formData.dish_name}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                placeholder="Describe the dish you'd love to have at Easter..."
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Who would you like to make this dish? (Optional)
                            </label>
                            <input
                                type="text"
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                placeholder="e.g., Aunt Mary makes the best apple pie..."
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Wish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 