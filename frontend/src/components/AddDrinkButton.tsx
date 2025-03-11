import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { DrinkForm } from './DrinkForm';
import toast from 'react-hot-toast';
import { useRoom } from '../contexts/RoomContext';

interface AddDrinkButtonProps {
    onSubmit: (drink: any) => void;
    onOpenModal: () => void;
    onCloseModal: () => void;
}

export const AddDrinkButton: React.FC<AddDrinkButtonProps> = ({
    onSubmit,
    onOpenModal,
    onCloseModal,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { room } = useRoom();
    const [lastUserDetails, setLastUserDetails] = useState<{
        fullName: string;
        member_id: number;
    } | null>(null);

    const handleSubmit = (drink: any) => {
        if (!room?.id) {
            toast.error('Room not found');
            return;
        }

        // Add room_id to the drink
        const drinkWithRoom = {
            ...drink,
            room_id: room.id
        };

        // Remember the user's details for next time
        setLastUserDetails({
            fullName: drink.fullName,
            member_id: drink.member_id
        });
        
        onSubmit(drinkWithRoom);
        
        // Close the dialog
        handleClose();
        
        // Show toast with message and action buttons
        toast(
            <div className="text-center">
                <div className="text-lg font-bold mb-3">
                    ✨🍾 Drink Added! Add another?
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            toast.dismiss('add-more-toast');
                            handleOpen();
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

    const handleOpen = () => {
        setIsOpen(true);
        onOpenModal();
    };

    const handleClose = () => {
        setIsOpen(false);
        onCloseModal();
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg 
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-emerald-500 shadow-sm transition-colors gap-2"
            >
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Add New Drink</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 text-center">Add New Drink</h2>
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <DrinkForm
                                initialValues={lastUserDetails ? {
                                    fullName: lastUserDetails.fullName,
                                    category: '',
                                    quantity: 0,
                                    member_id: lastUserDetails.member_id.toString()
                                } : undefined}
                                onSubmit={handleSubmit}
                                onCancel={handleClose}
                                submitButtonText="Add Drink"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 