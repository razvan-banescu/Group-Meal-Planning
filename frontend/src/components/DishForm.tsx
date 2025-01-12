import React, { useState, useEffect } from 'react';
import { Dish, Member, MealType } from '../types';
import { getMealTypes } from '../services/api';
import { useRoom } from '../contexts/RoomContext';

interface DishFormProps {
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
    initialValues?: Omit<Dish, 'id'>;
    onCancel?: () => void;
    submitButtonText?: string;
}

interface DishFormData {
    name: string;
    quantity: string;
    member_id: string;
    fullName: string;
    meal_type: string;
    room_id: number;
}

export const DishForm: React.FC<DishFormProps> = ({ onSubmit, initialValues, onCancel, submitButtonText }) => {
    const { room } = useRoom();
    const [mealTypes, setMealTypes] = useState<MealType[]>([]);
    const [formData, setFormData] = useState<DishFormData>({
        name: initialValues?.name || '',
        quantity: initialValues?.quantity?.toString() || '',
        member_id: initialValues?.member_id?.toString() || '',
        fullName: initialValues?.fullName || '',
        meal_type: initialValues?.meal_type || '',
        room_id: initialValues?.room_id || room?.id || 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mealTypesResponse = await getMealTypes();
                setMealTypes(mealTypesResponse.data);
            } catch (error) {
                console.error('Error fetching meal types:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData: Omit<Dish, 'id'> = {
            name: formData.name,
            quantity: formData.quantity === '' ? 0 : parseFloat(formData.quantity),
            member_id: formData.member_id === '' ? 0 : parseInt(formData.member_id),
            fullName: formData.fullName,
            meal_type: formData.meal_type,
            room_id: formData.room_id,
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Select family affiliation</option>
                    {room?.settings?.families.map((family, index) => (
                        <option key={index} value={index + 1}>
                            {family}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Dish Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    readOnly={!!initialValues?.name}
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm
                        ${initialValues?.name 
                            ? 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                />
            </div>

            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity (grams)
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="meal_type" className="block text-sm font-medium text-gray-700">
                    Meal Type
                </label>
                <select
                    id="meal_type"
                    name="meal_type"
                    value={formData.meal_type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Select meal type</option>
                    {mealTypes.map(type => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-3">
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
                    {submitButtonText || (initialValues ? 'Update Dish' : 'Add Dish')}
                </button>
            </div>
        </form>
    );
}; 