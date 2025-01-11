import React, { useState, useEffect } from 'react';
import { DishForm } from '../components/DishForm';
import { DishList } from '../components/DishList';
import { Dish } from '../types';
import { getDishes, createDish, updateDish, deleteDish } from '../services/api';

export const HomePage: React.FC = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await getDishes();
            setDishes(response.data);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const handleSubmit = async (dish: Omit<Dish, 'id'>) => {
        try {
            if (editingDish) {
                await updateDish(editingDish.id!, dish);
            } else {
                await createDish(dish);
            }
            fetchDishes();
            setEditingDish(null);
        } catch (error) {
            console.error('Error saving dish:', error);
        }
    };

    const handleEdit = (dish: Dish) => {
        setEditingDish(dish);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteDish(id);
            fetchDishes();
        } catch (error) {
            console.error('Error deleting dish:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Easter Meal Planning</h1>
                
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            {editingDish ? 'Edit Dish' : 'Add New Dish'}
                        </h2>
                        <DishForm
                            onSubmit={handleSubmit}
                            initialValues={editingDish || undefined}
                        />
                    </div>
                </div>

                <DishList
                    dishes={dishes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}; 