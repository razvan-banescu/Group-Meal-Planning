import React from 'react';
import { DrinkWishlistItem, Drink } from '../types';
import { DrinkResolveWishDialog } from './DrinkResolveWishDialog';

interface DrinkWishlistDisplayProps {
    wishes: DrinkWishlistItem[];
    onDelete: (id: number) => void;
    onResolve: (wish: DrinkWishlistItem, drink: Omit<Drink, 'id' | 'created_at'>) => void;
}

export const DrinkWishlistDisplay: React.FC<DrinkWishlistDisplayProps> = ({
    wishes,
    onDelete,
    onResolve,
}) => {
    const [selectedWish, setSelectedWish] = React.useState<DrinkWishlistItem | null>(null);

    if (wishes.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                No drink wishes yet
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {wishes.map((wish) => (
                    <div
                        key={wish.id}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    {wish.drink_name}
                                </h4>
                                {wish.brand && (
                                    <p className="text-sm text-gray-500">
                                        Brand: {wish.brand}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Quantity: {wish.requested_quantity} liters
                                </p>
                                {wish.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Description: {wish.description}
                                    </p>
                                )}
                                {wish.requested_from && (
                                    <p className="text-sm text-gray-500">
                                        Requested from: {wish.requested_from}
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedWish(wish)}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                >
                                    Resolve
                                </button>
                                <button
                                    onClick={() => onDelete(wish.id)}
                                    className="text-red-600 hover:text-red-900 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <DrinkResolveWishDialog
                wish={selectedWish}
                onClose={() => setSelectedWish(null)}
                onResolve={(drink) => {
                    if (selectedWish) {
                        onResolve(selectedWish, drink);
                        setSelectedWish(null);
                    }
                }}
            />
        </>
    );
}; 