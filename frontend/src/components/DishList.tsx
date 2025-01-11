import React, { useState, useEffect } from 'react';
import { Dish, FamilyAffiliation } from '../types';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { getFamilyAffiliations } from '../services/api';

interface DishListProps {
    dishes: Dish[];
    onEdit: (dish: Dish) => void;
    onDelete: (id: number) => void;
}

export const DishList: React.FC<DishListProps> = ({ dishes, onEdit, onDelete }) => {
    const [affiliations, setAffiliations] = useState<FamilyAffiliation[]>([]);

    useEffect(() => {
        const fetchAffiliations = async () => {
            try {
                const response = await getFamilyAffiliations();
                setAffiliations(response.data);
            } catch (error) {
                console.error('Error fetching family affiliations:', error);
            }
        };
        fetchAffiliations();
    }, []);

    const getAffiliationName = (id: number) => {
        const affiliation = affiliations.find(a => a.id === id);
        return affiliation?.name || 'Unknown';
    };

    return (
        <div className="mt-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                Full Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Dish Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Quantity (g)
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Family Affiliation
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {dishes.map((dish) => (
                            <tr key={dish.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                    {dish.fullName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {dish.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {dish.quantity}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {getAffiliationName(dish.member_id)}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(dish)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => dish.id && onDelete(dish.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 