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
    getRoom,
} from '../services/api';
import { AddDishButton } from '../components/AddDishButton';
import { useRoom } from '../contexts/RoomContext';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
    const { seed } = useParams<{ seed: string }>();
    const navigate = useNavigate();
    const { room, setRoom } = useRoom();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [wishes, setWishes] = useState<WishlistItem[]>([]);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const validateRoom = async () => {
            try {
                // If URL seed doesn't match current room's seed, fetch the room data
                if (seed && (!room || room.seed !== seed)) {
                    const response = await getRoom(seed);
                    setRoom(response.data);
                }
            } catch (error) {
                console.error('Error validating room:', error);
                toast.error('Invalid or expired room code');
                navigate('/', { replace: true });
            }
        };

        validateRoom();
    }, [seed, room, setRoom, navigate]);

    useEffect(() => {
        if (!room?.id) {
            navigate('/');
            return;
        }
        fetchDishes();
        fetchWishes();
    }, [room?.id, navigate]);

    const fetchDishes = async () => {
        if (!room?.id) return;
        try {
            const response = await getDishes(room.id);
            setDishes(response.data);
        } catch (error) {
            console.error('Error fetching dishes:', error);
            toast.error('Failed to fetch dishes');
        }
    };

    const fetchWishes = async () => {
        if (!room?.id) return;
        try {
            const response = await getWishlistItems(room.id);
            setWishes(response.data);
        } catch (error) {
            console.error('Error fetching wishes:', error);
            toast.error('Failed to fetch wishlist items');
        }
    };

    const handleDishSubmit = async (dish: Omit<Dish, 'id'>) => {
        if (!room?.id) return;
        try {
            const dishWithRoom = { ...dish, room_id: room.id };
            await createDish(dishWithRoom);
            await fetchDishes();
        } catch (error) {
            console.error('Failed to create dish:', error);
            toast.error('Failed to add dish');
        }
    };

    const handleDishEdit = async (id: number, updatedDish: Omit<Dish, 'id'>) => {
        if (!room?.id) return;
        try {
            const dishWithRoom = { ...updatedDish, room_id: room.id };
            await updateDish(room.id, id, dishWithRoom);
            await fetchDishes();
            toast.success('Dish updated successfully!');
        } catch (error) {
            console.error('Failed to update dish:', error);
            toast.error('Failed to update dish');
        }
    };

    const handleDishDelete = async (id: number) => {
        if (!room?.id) return;
        try {
            await deleteDish(room.id, id);
            await fetchDishes();
            toast.success('Dish deleted successfully!');
        } catch (error) {
            console.error('Error deleting dish:', error);
            toast.error('Failed to delete dish');
        }
    };

    const handleWishSubmit = async (wish: Omit<WishlistItem, 'id'>) => {
        if (!room?.id) return;
        try {
            const wishWithRoom = { ...wish, room_id: room.id };
            await createWishlistItem(wishWithRoom);
            await fetchWishes();
            toast.success('Wish added successfully!');
        } catch (error) {
            console.error('Error creating wish:', error);
            toast.error('Failed to add wish');
        }
    };

    const handleWishDelete = async (id: number) => {
        if (!room?.id) return;
        try {
            await deleteWishlistItem(room.id, id);
            await fetchWishes();
            toast.success('Wish deleted successfully!');
        } catch (error) {
            console.error('Error deleting wish:', error);
            toast.error('Failed to delete wish');
        }
    };

    const handleWishResolve = async (wish: WishlistItem, dish: Omit<Dish, 'id'>) => {
        if (!room?.id) return;
        try {
            // Create the new dish
            const dishWithRoom = { ...dish, room_id: room.id };
            await createDish(dishWithRoom);
            // Delete the resolved wish
            if (wish.id) {
                await deleteWishlistItem(room.id, wish.id);
            }
            // Refresh both lists
            await Promise.all([fetchDishes(), fetchWishes()]);
            toast.success('Wish resolved successfully!');
        } catch (error) {
            console.error('Error resolving wish:', error);
            toast.error('Failed to resolve wish');
        }
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
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
                        <div className="lg:col-span-3 bg-gradient-to-b from-blue-200/80 to-white/90 rounded-xl p-6 transition-shadow hover:shadow-lg h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Easter Dishes</h2>
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <span className="text-lg font-medium text-gray-700">What are you going to bring?</span>
                                <AddDishButton 
                                    onSubmit={handleDishSubmit}
                                    onOpenModal={handleModalOpen}
                                    onCloseModal={handleModalClose}
                                />
                            </div>
                            <DishList
                                dishes={dishes}
                                onEdit={handleDishEdit}
                                onDelete={handleDishDelete}
                            />
                        </div>
                        <div className="lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-10 bg-gradient-to-b from-[#F2E6FF] to-white/90 rounded-xl p-6 transition-shadow hover:shadow-lg h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Meal Wishlist</h2>
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <span className="text-lg font-medium text-gray-700">Make a special request!</span>
                                <WishlistForm 
                                    onSubmit={handleWishSubmit}
                                    onOpenModal={handleModalOpen}
                                    onCloseModal={handleModalClose}
                                />
                            </div>
                            <div className="mt-6">
                                <WishlistDisplay
                                    wishes={wishes}
                                    onDelete={handleWishDelete}
                                    onResolve={handleWishResolve}
                                />
                            </div>
                        </div>
                        <div className={`lg:col-span-2 ${!isModalOpen ? 'lg:border-l lg:border-gray-200' : ''} lg:pl-10 p-6 sticky top-4`}>
                            <TotalsByType dishes={dishes} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}; 