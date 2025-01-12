import React, { useState } from 'react';
import { WishlistItem, Dish } from '../types';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ResolveWishDialog } from './ResolveWishDialog';

interface WishlistDisplayProps {
    wishes: WishlistItem[];
    onDelete: (id: number) => void;
    onResolve: (wish: WishlistItem, dish: Omit<Dish, 'id'>) => void;
}

export const WishlistDisplay: React.FC<WishlistDisplayProps> = ({ 
    wishes, 
    onDelete,
    onResolve 
}) => {
    const [resolvingWish, setResolvingWish] = useState<WishlistItem | null>(null);

    if (wishes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No wishes yet. Add one to get started!
            </div>
        );
    }

    return (
        <>
            <div className="space-y-2">
                {wishes.map((wish) => (
                    <div
                        key={wish.id}
                        className="bg-white shadow rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                        <div className="flex-1">
                            <div className="flex items-baseline mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{wish.dish_name}</h3>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                {wish.notes && (
                                    <>
                                        <span>Directed to: {wish.notes}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={() => setResolvingWish(wish)}
                                className="text-green-600 hover:text-green-700 flex items-center space-x-1 p-1 rounded-full hover:bg-green-50 transition-colors"
                                title="Resolve Wish"
                            >
                                <CheckCircleIcon className="h-5 w-5" />
                                <span className="text-sm">Resolve</span>
                            </button>
                            <button
                                onClick={() => wish.id && onDelete(wish.id)}
                                className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Delete Wish"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {resolvingWish && (
                <ResolveWishDialog
                    wish={resolvingWish}
                    onClose={() => setResolvingWish(null)}
                    onSubmit={(dish) => {
                        onResolve(resolvingWish, dish);
                        setResolvingWish(null);
                    }}
                />
            )}
        </>
    );
}; 