import React from 'react';
import { WishlistItem, Dish } from '../types';
import { DishForm } from './DishForm';

interface ResolveWishDialogProps {
    wish: WishlistItem;
    onClose: () => void;
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
}

export const ResolveWishDialog: React.FC<ResolveWishDialogProps> = ({
    wish,
    onClose,
    onSubmit
}) => {
    const initialValues = {
        name: wish.dish_name,
        quantity: 0,
        fullName: '',
        member_id: 0,
        meal_type: ''
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 text-center">
                        Resolve Wish: {wish.dish_name}
                    </h3>
                    {wish.notes && (
                        <p className="mt-1 text-sm text-gray-500 text-center">
                            Originally requested from: {wish.notes}
                        </p>
                    )}
                </div>
                
                <div className="p-6">
                    <DishForm
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}; 