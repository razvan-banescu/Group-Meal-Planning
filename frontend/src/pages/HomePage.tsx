import React, { useState, useEffect } from 'react';
import { DishForm } from '../components/DishForm';
import { DishList } from '../components/DishList';
import { WishlistForm } from '../components/WishlistForm';
import { WishlistDisplay } from '../components/WishlistDisplay';
import { TotalsByType } from '../components/TotalsByType';
import { Dish, WishlistItem } from '../types';
import { Toaster } from 'react-hot-toast';
import {
    getDishes,
    createDish,
    updateDish,
    deleteDish,
    getWishlistItems,
    createWishlistItem,
    deleteWishlistItem,
} from '../services/api';
import { AddDishButton } from '../components/AddDishButton';

export const HomePage: React.FC = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [wishes, setWishes] = useState<WishlistItem[]>([]);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);

    useEffect(() => {
        fetchDishes();
        fetchWishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await getDishes();
            setDishes(response.data);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const fetchWishes = async () => {
        try {
            const response = await getWishlistItems();
            setWishes(response.data);
        } catch (error) {
            console.error('Error fetching wishes:', error);
        }
    };

    const handleDishSubmit = async (dish: Omit<Dish, 'id'>) => {
        try {
            await createDish(dish);
            await fetchDishes();
        } catch (error) {
            console.error('Failed to create dish:', error);
        }
    };

    const handleDishEdit = async (id: number, updatedDish: Omit<Dish, 'id'>) => {
        try {
            await updateDish(id, updatedDish);
            await fetchDishes();
        } catch (error) {
            console.error('Failed to update dish:', error);
        }
    };

    const handleDishDelete = async (id: number) => {
        try {
            await deleteDish(id);
            fetchDishes();
        } catch (error) {
            console.error('Error deleting dish:', error);
        }
    };

    const handleWishSubmit = async (wish: Omit<WishlistItem, 'id'>) => {
        try {
            await createWishlistItem(wish);
            fetchWishes();
        } catch (error) {
            console.error('Error creating wish:', error);
        }
    };

    const handleWishDelete = async (id: number) => {
        try {
            await deleteWishlistItem(id);
            fetchWishes();
        } catch (error) {
            console.error('Error deleting wish:', error);
        }
    };

    const handleWishResolve = async (wish: WishlistItem, dish: Omit<Dish, 'id'>) => {
        try {
            // Create the new dish
            await createDish(dish);
            // Delete the resolved wish
            if (wish.id) {
                await deleteWishlistItem(wish.id);
            }
            // Refresh both lists
            fetchDishes();
            fetchWishes();
        } catch (error) {
            console.error('Error resolving wish:', error);
        }
    };

    return (
        <>
            <Toaster
                position="bottom-center"
                containerStyle={{
                    top: '15%',
                    transform: 'translateY(-50%)'
                }}
            />
            <div className="px-10">
                <div className="max-w-[1920px] mx-auto py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
                        <div className="lg:col-span-3 bg-gradient-to-b from-blue-50/50 to-white rounded-xl p-6 transition-shadow hover:shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Easter Dishes</h2>
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <span className="text-lg font-medium text-gray-700">What are you going to bring?</span>
                                <AddDishButton onSubmit={handleDishSubmit} />
                            </div>
                            <DishList
                                dishes={dishes}
                                onEdit={handleDishEdit}
                                onDelete={handleDishDelete}
                            />
                        </div>
                        <div className="lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-10 bg-gradient-to-b from-purple-50/50 to-white rounded-xl p-6 transition-shadow hover:shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Meal Wishlist</h2>
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <span className="text-lg font-medium text-gray-700">Make a special request!</span>
                                <WishlistForm onSubmit={handleWishSubmit} />
                            </div>
                            <div className="mt-6">
                                <WishlistDisplay
                                    wishes={wishes}
                                    onDelete={handleWishDelete}
                                    onResolve={handleWishResolve}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-10 p-6">
                            <TotalsByType dishes={dishes} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}; 