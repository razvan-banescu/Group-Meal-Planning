import React, { useState } from 'react';
import { useRoom } from '../contexts/RoomContext';
import { Dialog } from '@headlessui/react';
import { Modal } from './Modal';

interface DrinkWishFormProps {
    onSubmit: (wish: {
        drink_name: string;
        brand?: string;
        description?: string;
        requested_from?: string;
        requested_quantity: number;
        room_id: number;
    }) => void;
    onOpenModal: () => void;
    onCloseModal: () => void;
}

export const DrinkWishForm: React.FC<DrinkWishFormProps> = ({
    onSubmit,
    onOpenModal,
    onCloseModal,
}) => {
    const { room } = useRoom();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        drink_name: '',
        brand: '',
        description: '',
        requested_from: '',
        requested_quantity: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!room?.id) return;

        onSubmit({
            drink_name: formData.drink_name,
            brand: formData.brand || undefined,
            description: formData.description || undefined,
            requested_from: formData.requested_from || undefined,
            requested_quantity: parseFloat(formData.requested_quantity),
            room_id: room.id,
        });
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpen = () => {
        setIsOpen(true);
        onOpenModal();
    };

    const handleClose = () => {
        setIsOpen(false);
        onCloseModal();
        setFormData({
            drink_name: '',
            brand: '',
            description: '',
            requested_from: '',
            requested_quantity: '1',
        });
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add Wish
            </button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                    Add New Drink Wish
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="drink_name" className="block text-sm font-medium text-gray-700">
                            What drink would you like someone to bring?
                        </label>
                        <input
                            type="text"
                            id="drink_name"
                            name="drink_name"
                            value={formData.drink_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter the name of the drink you wish for"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                            What brand?
                        </label>
                        <input
                            type="text"
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Enter the preferred brand (optional)"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add any additional details about your drink wish"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="requested_from" className="block text-sm font-medium text-gray-700">
                            Who would you like to bring the drink? (Optional)
                        </label>
                        <input
                            type="text"
                            id="requested_from"
                            name="requested_from"
                            value={formData.requested_from}
                            onChange={handleChange}
                            placeholder="Enter the name of the person you'd like to bring this"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="requested_quantity" className="block text-sm font-medium text-gray-700">
                            Quantity (liters)
                        </label>
                        <input
                            type="number"
                            id="requested_quantity"
                            name="requested_quantity"
                            value={formData.requested_quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.1"
                            placeholder="Enter the desired quantity in liters"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
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
            </Modal>
        </>
    );
}; 