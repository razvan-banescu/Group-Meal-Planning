import React, { useState, useEffect } from 'react';
import { Dish, FamilyAffiliation } from '../types';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { EditDishDialog } from './EditDishDialog';
import { getFamilyAffiliations } from '../services/api';

interface DishListProps {
    dishes: Dish[];
    onEdit: (id: number, updatedDish: Omit<Dish, 'id'>) => void;
    onDelete: (id: number) => void;
}

export const DishList: React.FC<DishListProps> = ({ dishes, onEdit, onDelete }) => {
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [affiliations, setAffiliations] = useState<FamilyAffiliation[]>([]);

    useEffect(() => {
        const fetchAffiliations = async () => {
            try {
                const response = await getFamilyAffiliations();
                setAffiliations(response.data);
            } catch (error) {
                console.error('Failed to fetch family affiliations:', error);
            }
        };
        fetchAffiliations();
    }, []);

    const getAffiliationName = (id: number) => {
        const affiliation = affiliations.find(a => a.id === id);
        return affiliation ? affiliation.name : 'Unknown';
    };

    if (dishes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No dishes yet. Add one to get started!
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {dishes.map((dish) => (
                    <div
                        key={dish.id}
                        className="bg-white shadow rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow"
                    >
                        <div className="flex-1">
                            <div className="flex items-baseline space-x-3">
                                <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                                <span className="text-lg font-medium text-emerald-600">{dish.quantity}g</span>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                <div className="flex items-center">
                                    <span className="font-medium">By:</span>
                                    <span className="ml-1">{dish.fullName}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium">Family:</span>
                                    <span className="ml-1">{getAffiliationName(dish.member_id)}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium">Type:</span>
                                    <span className="ml-1">{dish.meal_type}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={() => setEditingDish(dish)}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                title="Edit Dish"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => dish.id && onDelete(dish.id)}
                                className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Delete Dish"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingDish && (
                <EditDishDialog
                    dish={editingDish}
                    onClose={() => setEditingDish(null)}
                    onSubmit={(updatedDish) => {
                        if (editingDish.id) {
                            onEdit(editingDish.id, updatedDish);
                            setEditingDish(null);
                        }
                    }}
                />
            )}
        </>
    );
}; 