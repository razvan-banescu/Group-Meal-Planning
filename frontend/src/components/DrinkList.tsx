import React, { useState } from 'react';
import { Drink } from '../types';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useRoom } from '../contexts/RoomContext';

interface DrinkListProps {
    drinks: Drink[];
    onEdit: (id: number, drink: Omit<Drink, 'id'>) => void;
    onDelete: (id: number) => void;
}

type SortOption = 'quantity_high' | 'quantity_low' | 'family' | 'type' | 'none';

export const DrinkList: React.FC<DrinkListProps> = ({ drinks, onEdit, onDelete }) => {
    const { room } = useRoom();
    const [sortBy, setSortBy] = useState<SortOption>('none');

    const getFamilyName = (member_id: number) => {
        if (!room?.settings?.families || room.settings.families.length === 0) {
            return '';
        }
        // member_id is already 1-based index into the families array
        const familyIndex = member_id - 1;
        if (familyIndex < 0 || familyIndex >= room.settings.families.length) {
            return 'Unknown';
        }
        return room.settings.families[familyIndex];
    };

    const sortedDrinks = [...drinks].sort((a, b) => {
        switch (sortBy) {
            case 'quantity_high':
                return b.quantity - a.quantity;
            case 'quantity_low':
                return a.quantity - b.quantity;
            case 'family':
                return room?.settings?.families?.length ? 
                    getFamilyName(a.member_id).localeCompare(getFamilyName(b.member_id)) :
                    0;
            case 'type':
                return a.category.localeCompare(b.category);
            default:
                return 0;
        }
    });

    if (drinks.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No drinks yet. Add one to get started!
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
                    {room?.settings?.families && room.settings.families.length > 0 && (
                        <option value="family">Family Affiliation</option>
                    )}
                    <option value="type">Category</option>
                </select>
            </div>

            <div className="space-y-4">
                {sortedDrinks.map((drink) => (
                    <div
                        key={drink.id}
                        className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{drink.category === 'Other' ? drink.other_category : drink.category}</h3>
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-medium text-emerald-600 tabular-nums">
                                    {drink.quantity.toFixed(1)}L
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(drink.id, drink)}
                                        className="p-1.5 text-blue-400 hover:text-blue-600 transition-colors"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(drink.id)}
                                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 text-sm text-gray-500 px-1">
                            {room?.settings?.families && room.settings.families.length > 0 ? (
                                <>
                                    <span>{getFamilyName(drink.member_id)} Family</span>
                                    <span className="text-center">By {drink.fullName}</span>
                                    <span className="text-right">{drink.brand || 'No brand'}</span>
                                </>
                            ) : (
                                <>
                                    <span>By {drink.fullName}</span>
                                    <span className="text-center">{drink.brand || 'No brand'}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}; 