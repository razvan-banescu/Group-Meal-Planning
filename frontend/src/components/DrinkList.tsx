import React from 'react';
import { Drink } from '../types';

interface DrinkListProps {
    drinks: Drink[];
    onEdit: (id: number, drink: Omit<Drink, 'id'>) => void;
    onDelete: (id: number) => void;
}

export const DrinkList: React.FC<DrinkListProps> = ({ drinks, onEdit, onDelete }) => {
    if (drinks.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No drinks yet. Be the first to add one!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {drinks.map((drink) => (
                <div
                    key={drink.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{drink.fullName}</h3>
                            <div className="mt-1 text-sm text-gray-500 space-y-1">
                                <p>Category: {drink.category === 'Other' ? drink.other_category : drink.category}</p>
                                {drink.brand && <p>Brand: {drink.brand}</p>}
                                <p>Quantity: {drink.quantity} liters</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(drink.id, drink)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(drink.id)}
                                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}; 