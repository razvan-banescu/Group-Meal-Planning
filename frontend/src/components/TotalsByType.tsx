import React from 'react';
import { Dish } from '../types';

interface TotalsByTypeProps {
    dishes: Dish[];
}

interface TypeTotal {
    type: string;
    dishes: Dish[];
    totalQuantity: number;
}

export const TotalsByType: React.FC<TotalsByTypeProps> = ({ dishes }) => {
    // Group dishes by type and calculate totals
    const totals = dishes.reduce<Record<string, TypeTotal>>((acc, dish) => {
        if (!acc[dish.meal_type]) {
            acc[dish.meal_type] = {
                type: dish.meal_type,
                dishes: [],
                totalQuantity: 0
            };
        }
        acc[dish.meal_type].dishes.push(dish);
        acc[dish.meal_type].totalQuantity += dish.quantity;
        return acc;
    }, {});

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 text-center">
                    Totals... so far
                </h3>
                
                <div className="space-y-2">
                    {Object.values(totals).map((total) => (
                        <div key={total.type} 
                             className="group hover:bg-white hover:shadow-md rounded-lg p-3 transition-all duration-200 ease-in-out">
                            <div className="flex items-baseline px-2 mb-2">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {total.type} ({total.dishes.length})
                                    </h4>
                                </div>
                                <div className="w-20 text-right">
                                    <span className="text-lg font-semibold text-emerald-600 tabular-nums">
                                        {total.totalQuantity}g
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-1 border-t border-gray-100 pt-1">
                                {total.dishes.map((dish) => (
                                    <li key={dish.id} 
                                        className="flex items-center px-2 py-0.5 text-base rounded
                                                 group-hover:bg-gray-50 transition-colors duration-150">
                                        <div className="flex-1">
                                            <span className="text-gray-700">{dish.name}</span>
                                        </div>
                                        <div className="w-20 text-right">
                                            <span className="text-gray-600 tabular-nums">
                                                {dish.quantity}g
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    
                    {Object.keys(totals).length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            <p className="text-lg">No dishes added yet</p>
                            <p className="text-base mt-1 text-gray-400">Dishes will appear here as they are added</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 