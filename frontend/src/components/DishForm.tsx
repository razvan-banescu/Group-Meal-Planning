import React, { useState, useEffect } from 'react';
import { Dish, Member, FamilyAffiliation, MealType } from '../types';
import { getMembers, getFamilyAffiliations, getMealTypes } from '../services/api';

interface DishFormProps {
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
    initialValues?: Dish;
}

interface DishFormData {
    name: string;
    quantity: string;
    member_id: string;
    fullName: string;
    meal_type: string;
}

export const DishForm: React.FC<DishFormProps> = ({ onSubmit, initialValues }) => {
    const [affiliations, setAffiliations] = useState<FamilyAffiliation[]>([]);
    const [mealTypes, setMealTypes] = useState<MealType[]>([]);
    const [formData, setFormData] = useState<DishFormData>({
        name: initialValues?.name || '',
        quantity: initialValues?.quantity?.toString() || '',
        member_id: initialValues?.member_id?.toString() || '',
        fullName: initialValues?.fullName || '',
        meal_type: initialValues?.meal_type || '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [affiliationsResponse, mealTypesResponse] = await Promise.all([
                    getFamilyAffiliations(),
                    getMealTypes()
                ]);
                setAffiliations(affiliationsResponse.data);
                setMealTypes(mealTypesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData: Omit<Dish, 'id'> = {
            name: formData.name,
            quantity: formData.quantity === '' ? 0 : parseFloat(formData.quantity),
            member_id: parseInt(formData.member_id),
            fullName: formData.fullName,
            meal_type: formData.meal_type,
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
                    {affiliations.map(affiliation => (
                        <option key={affiliation.id} value={affiliation.id}>
                            {affiliation.name}
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

            <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                {initialValues ? 'Update Dish' : 'Add Dish'}
            </button>
        </form>
    );
}; 