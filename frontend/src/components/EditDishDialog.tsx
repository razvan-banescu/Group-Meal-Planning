import React from 'react';
import { Dish } from '../types';
import { DishForm } from './DishForm';

interface EditDishDialogProps {
    dish: Dish;
    onClose: () => void;
    onSubmit: (updatedDish: Omit<Dish, 'id'>) => void;
}

export const EditDishDialog: React.FC<EditDishDialogProps> = ({
    dish,
    onClose,
    onSubmit
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Edit Dish</h2>
                <DishForm
                    initialValues={{
                        name: dish.name,
                        quantity: dish.quantity,
                        fullName: dish.fullName,
                        member_id: dish.member_id,
                        meal_type: dish.meal_type
                    }}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    submitButtonText="Update Dish"
                />
            </div>
        </div>
    );
}; 