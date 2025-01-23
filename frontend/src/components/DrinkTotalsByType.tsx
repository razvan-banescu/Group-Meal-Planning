import React from 'react';
import { Drink } from '../types';

interface DrinkTotalsByTypeProps {
    drinks: Drink[];
}

interface CategoryTotal {
    totalQuantity: number;
    brands: {
        name: string;
        quantity: number;
    }[];
}

export const DrinkTotalsByType: React.FC<DrinkTotalsByTypeProps> = ({ drinks }) => {
    const totals = drinks.reduce((acc, drink) => {
        const category = drink.category === 'Other' ? drink.other_category || 'Other' : drink.category;
        
        if (!acc[category]) {
            acc[category] = {
                totalQuantity: 0,
                brands: []
            };
        }

        acc[category].totalQuantity += drink.quantity;

        if (drink.brand) {
            const existingBrand = acc[category].brands.find(b => b.name === drink.brand);
            if (existingBrand) {
                existingBrand.quantity += drink.quantity;
            } else {
                acc[category].brands.push({
                    name: drink.brand,
                    quantity: drink.quantity
                });
            }
        }

        return acc;
    }, {} as Record<string, CategoryTotal>);

    const sortedCategories = Object.entries(totals).sort((a, b) => a[0].localeCompare(b[0]));

    return (
        <div className="bg-gradient-to-b from-green-100/80 to-white/90 rounded-xl p-6 transition-shadow hover:shadow-lg h-fit sticky top-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Drinks so far...</h3>
            <div className="space-y-6">
                {sortedCategories.map(([category, data]) => (
                    <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center font-medium text-gray-900">
                            <span>{category}</span>
                            <span>{data.totalQuantity.toFixed(1)} L</span>
                        </div>
                        {data.brands.length > 0 && (
                            <div className="pl-4 text-sm text-gray-500">
                                {data.brands
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((brand, index) => (
                                        <React.Fragment key={index}>
                                            {brand.name} ({brand.quantity.toFixed(1)} L)
                                            {index < data.brands.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                ))}
                {sortedCategories.length === 0 && (
                    <div className="text-center text-gray-500">
                        No drinks added yet
                    </div>
                )}
            </div>
        </div>
    );
}; 