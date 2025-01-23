import React, { useState, useEffect } from 'react';
import { useRoom } from '../contexts/RoomContext';

interface DrinkFormProps {
    onSubmit: (drink: {
        fullName: string;
        category: string;
        other_category?: string;
        brand?: string;
        quantity: number;
        member_id: number;
        room_id: number;
    }) => void;
    onCancel?: () => void;
    submitButtonText?: string;
    initialValues?: {
        fullName?: string;
        category?: string;
        other_category?: string;
        brand?: string;
        quantity?: number;
        member_id?: string;
    };
}

export const DrinkForm: React.FC<DrinkFormProps> = ({ onSubmit, onCancel, submitButtonText, initialValues }) => {
    const { room } = useRoom();
    const [formData, setFormData] = useState({
        fullName: initialValues?.fullName || '',
        category: initialValues?.category || '',
        other_category: initialValues?.other_category || '',
        brand: initialValues?.brand || '',
        quantity: initialValues?.quantity?.toString() || '',
        member_id: initialValues?.member_id || '',
    });

    const drinkCategories = [
        { id: 1, name: 'Spirits' },
        { id: 2, name: 'Wine' },
        { id: 3, name: 'Beer' },
        { id: 4, name: 'Soft Drinks' },
        { id: 5, name: 'Mixers' },
        { id: 6, name: 'Other' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = {
            fullName: formData.fullName,
            category: formData.category,
            other_category: formData.category === 'Other' ? formData.other_category : undefined,
            brand: formData.brand || undefined,
            quantity: parseFloat(formData.quantity),
            member_id: room?.settings?.families?.length ? parseInt(formData.member_id) : 0,
            room_id: room?.id || 0,
        };
        onSubmit(submissionData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter the name of your drink"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {room?.settings?.families && room.settings.families.length > 0 && (
                <div>
                    <label htmlFor="member_id" className="block text-sm font-medium text-gray-700">
                        Family Affiliation
                    </label>
                    <select
                        id="member_id"
                        name="member_id"
                        value={formData.member_id}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select your family</option>
                        {room?.settings?.families.map((family, index) => (
                            <option key={index} value={index + 1}>
                                {family}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Drink Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a category</option>
                    {drinkCategories.map(category => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {formData.category === 'Other' && (
                <div>
                    <label htmlFor="other_category" className="block text-sm font-medium text-gray-700">
                        Specify Other Category
                    </label>
                    <input
                        type="text"
                        id="other_category"
                        name="other_category"
                        value={formData.other_category}
                        onChange={handleChange}
                        required
                        placeholder="Enter the drink category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            )}

            <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand (optional)
                </label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter the brand name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity (liters)
                </label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder="Enter the quantity in liters"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {submitButtonText || 'Add Drink'}
                </button>
            </div>
        </form>
    );
}; 