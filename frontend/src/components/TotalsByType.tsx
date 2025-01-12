import React from 'react';
import { Dish } from '../types';

interface TotalsByTypeProps {
    dishes: Dish[];
}

interface TypeTotal {
    type: string;
    dishes: Array<{
        id?: number;
        name: string;
        quantity: number;
        contributors: string[];
    }>;
    totalQuantity: number;
}

const MEAL_TYPE_ORDER = {
    'Entree': 1,
    'Main Course': 2,
    'Desert': 3
};

const formatQuantity = (grams: number) => {
    if (grams >= 1000) {
        const kg = grams / 1000;
        return `${kg.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}kg`;
    }
    return `${grams.toLocaleString('en-US')}g`;
};

export const TotalsByType: React.FC<TotalsByTypeProps> = ({ dishes }) => {
    // Group dishes by type and calculate totals with name aggregation
    const totals = dishes.reduce<Record<string, TypeTotal>>((acc, dish) => {
        if (!acc[dish.meal_type]) {
            acc[dish.meal_type] = {
                type: dish.meal_type,
                dishes: [],
                totalQuantity: 0
            };
        }

        // Find existing dish with same name
        const existingDish = acc[dish.meal_type].dishes.find(d => d.name.toLowerCase() === dish.name.toLowerCase());
        
        if (existingDish) {
            // Update existing dish
            existingDish.quantity += dish.quantity;
            if (!existingDish.contributors.includes(dish.fullName)) {
                existingDish.contributors.push(dish.fullName);
            }
        } else {
            // Add new dish
            acc[dish.meal_type].dishes.push({
                id: dish.id,
                name: dish.name,
                quantity: dish.quantity,
                contributors: [dish.fullName]
            });
        }

        acc[dish.meal_type].totalQuantity += dish.quantity;
        return acc;
    }, {});

    // Create ordered array of totals
    const orderedTotals = Object.entries(totals)
        .map(([type, data]) => ({
            ...data,
            order: MEAL_TYPE_ORDER[type as keyof typeof MEAL_TYPE_ORDER] || 999
        }))
        .sort((a, b) => a.order - b.order);

    return (
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 text-center">
                    Totals... so far
                </h3>
                
                <div className="space-y-2">
                    {orderedTotals.map((total, index) => (
                        <div key={total.type}>
                            <div className="group hover:bg-gray-50/80 rounded-lg p-3 transition-all duration-200 ease-in-out">
                                <div className="flex items-baseline px-2 mb-2">
                                    <div className="flex-1">
                                        <h4 className="text-base font-semibold text-gray-900">
                                            {total.type} ({total.dishes.length})
                                        </h4>
                                    </div>
                                    <div className="w-24 text-right">
                                        <span className="text-base font-bold text-emerald-600 tabular-nums">
                                            {formatQuantity(total.totalQuantity)}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-1 pt-1">
                                    {total.dishes.map((dish) => (
                                        <li key={dish.name} 
                                            className="flex items-center px-2 py-0.5 text-sm rounded
                                                     group-hover:bg-white transition-colors duration-150">
                                            <div className="flex-1">
                                                <span className="text-gray-700">{dish.name}</span>
                                            </div>
                                            <div className="w-24 text-right">
                                                <span className="text-gray-600 tabular-nums">
                                                    {dish.quantity.toLocaleString('en-US')}g
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {index < orderedTotals.length - 1 && (
                                <div className="my-2 border-b border-gray-200"></div>
                            )}
                        </div>
                    ))}
                    
                    {Object.keys(totals).length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No dishes added yet</p>
                            <p className="text-xs mt-1 text-gray-400">Dishes will appear here as they are added</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 