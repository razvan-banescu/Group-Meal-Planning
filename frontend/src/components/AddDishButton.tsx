import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Dish } from '../types';
import { DishForm } from './DishForm';
import toast from 'react-hot-toast';

interface AddDishButtonProps {
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
}

export const AddDishButton: React.FC<AddDishButtonProps> = ({ onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [lastUserDetails, setLastUserDetails] = useState<{
        fullName: string;
        member_id: number;
    } | null>(null);

    const handleSubmit = (dish: Omit<Dish, 'id'>) => {
        // Remember the user's details for next time
        setLastUserDetails({
            fullName: dish.fullName,
            member_id: dish.member_id
        });
        onSubmit(dish);
        
        // Close the dialog
        setIsOpen(false);
        
        // Show toast with message and action buttons
        toast(
            <div className="text-center">
                <div className="text-lg font-bold mb-3">
                    ✨🍾 Dish Added! Add another?
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            toast.dismiss('add-more-toast');
                            setIsOpen(true);
                        }}
                        className="font-bold text-emerald-400 hover:text-emerald-300"
                    >
                        Add More
                    </button>
                    <button
                        onClick={() => toast.dismiss('add-more-toast')}
                        className="font-bold text-gray-300 hover:text-gray-200"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                duration: 3000,
                style: {
                    background: '#1a365d',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
                id: 'add-more-toast',
            }
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg 
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-emerald-500 shadow-sm transition-colors gap-2"
            >
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Add New Dish</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">Add New Dish</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <DishForm
                            initialValues={lastUserDetails ? {
                                name: '',
                                quantity: 0,
                                meal_type: '',
                                ...lastUserDetails
                            } : undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsOpen(false)}
                            submitButtonText="Add Dish"
                        />
                    </div>
                </div>
            )}
        </>
    );
}; 