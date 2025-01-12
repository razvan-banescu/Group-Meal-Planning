import React, { useState } from 'react';
import { Dish } from '../types';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { EditDishDialog } from './EditDishDialog';
import { useRoom } from '../contexts/RoomContext';

interface DishListProps {
    dishes: Dish[];
    onEdit: (id: number, updatedDish: Omit<Dish, 'id'>) => void;
    onDelete: (id: number) => void;
}

type SortOption = 'quantity_high' | 'quantity_low' | 'family' | 'type' | 'none';

// Define meal type order for sorting
const MEAL_TYPE_ORDER = {
    'Entree': 1,
    'Main Course': 2,
    'Desert': 3
};

export const DishList: React.FC<DishListProps> = ({ dishes, onEdit, onDelete }) => {
    const { room } = useRoom();
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('none');

    const getFamilyName = (member_id: number) => {
        if (!room?.settings?.families) {
            return 'Unknown';
        }
        // member_id is already 1-based index into the families array
        const familyIndex = member_id - 1;
        if (familyIndex < 0 || familyIndex >= room.settings.families.length) {
            return 'Unknown';
        }
        return room.settings.families[familyIndex];
    };

    const getMealTypeOrder = (type: string) => {
        return MEAL_TYPE_ORDER[type as keyof typeof MEAL_TYPE_ORDER] || 999;
    };

    const sortedDishes = [...dishes].sort((a, b) => {
        switch (sortBy) {
            case 'quantity_high':
                return b.quantity - a.quantity;
            case 'quantity_low':
                return a.quantity - b.quantity;
            case 'family':
                return getFamilyName(a.member_id).localeCompare(getFamilyName(b.member_id));
            case 'type':
                return getMealTypeOrder(a.meal_type) - getMealTypeOrder(b.meal_type);
            default:
                return 0;
        }
    });

    if (dishes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No dishes yet. Add one to get started!
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex justify-start">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="block w-56 rounded-md border-gray-300 shadow-sm 
                             focus:border-emerald-500 focus:ring-emerald-500 text-sm
                             bg-white cursor-pointer"
                >
                    <option value="none">Sort by...</option>
                    <option value="quantity_high">Quantity (High to Low)</option>
                    <option value="quantity_low">Quantity (Low to High)</option>
                    <option value="family">Family Affiliation</option>
                    <option value="type">Course Order (Entree first)</option>
                </select>
            </div>

            <div className="space-y-4">
                {sortedDishes.map((dish) => (
                    <div
                        key={dish.id}
                        className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-medium text-emerald-600 tabular-nums">
                                    {dish.quantity.toLocaleString('en-US')}g
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingDish(dish)}
                                        className="p-1.5 text-blue-400 hover:text-blue-600 transition-colors"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(dish.id)}
                                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 text-sm text-gray-500 px-1">
                            <span>{getFamilyName(dish.member_id)} Family</span>
                            <span className="text-center">By {dish.fullName}</span>
                            <span className="text-right">{dish.meal_type}</span>
                        </div>
                    </div>
                ))}
            </div>

            {editingDish && (
                <EditDishDialog
                    dish={editingDish}
                    onClose={() => setEditingDish(null)}
                    onSubmit={(updatedDish) => {
                        onEdit(editingDish.id, updatedDish);
                        setEditingDish(null);
                    }}
                />
            )}
        </>
    );
}; 