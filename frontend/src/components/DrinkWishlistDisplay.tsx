import React from 'react';
import { DrinkWishlistItem, Drink } from '../types';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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
                <p className="text-sm">No drink wishes yet</p>
                <p className="text-xs mt-1 text-gray-400">Add a wish for a drink you'd like someone to bring</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {wishes.map((wish) => (
                    <div
                        key={wish.id}
                        className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-grow">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {wish.drink_name}
                                </h4>
                                <div className="mt-1 text-sm text-gray-500 space-y-1">
                                    {wish.brand && <p>Brand: {wish.brand}</p>}
                                    <p>Quantity: {wish.requested_quantity.toLocaleString('en-US')}L</p>
                                    {wish.description && <p>Description: {wish.description}</p>}
                                    {wish.requested_from && <p>Requested from: {wish.requested_from}</p>}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => setSelectedWish(wish)}
                                    className="text-green-600 hover:text-green-700 flex items-center space-x-1 p-1 rounded-full hover:bg-green-50 transition-colors"
                                    title="Resolve Wish"
                                >
                                    <CheckCircleIcon className="h-5 w-5" />
                                    <span className="text-sm">Resolve</span>
                                </button>
                                <button
                                    onClick={() => onDelete(wish.id)}
                                    className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete Wish"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedWish && (
                <DrinkResolveWishDialog
                    wish={selectedWish}
                    onClose={() => setSelectedWish(null)}
                    onResolve={(drink) => {
                        onResolve(selectedWish, drink);
                        setSelectedWish(null);
                    }}
                />
            )}
        </>
    );
}; 