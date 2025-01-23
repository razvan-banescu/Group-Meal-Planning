import React, { useState, useEffect } from 'react';
import { DrinkForm } from '../components/DrinkForm';
import { DrinkList } from '../components/DrinkList';
import { DrinkWishForm } from '../components/DrinkWishForm';
import { DrinkWishlistDisplay } from '../components/DrinkWishlistDisplay';
import { DrinkTotalsByType } from '../components/DrinkTotalsByType';
import { Drink, DrinkWishlistItem } from '../types';
import { Toaster } from 'react-hot-toast';
import {
    getDrinks,
    createDrink,
    updateDrink,
    deleteDrink,
    getDrinkWishes,
    createDrinkWish,
    deleteDrinkWish,
    getRoom,
} from '../services/api';
import { AddDrinkButton } from '../components/AddDrinkButton';
import { useRoom } from '../contexts/RoomContext';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export const DrinksPage: React.FC = () => {
    const { seed } = useParams<{ seed: string }>();
    const navigate = useNavigate();
    const { room, setRoom } = useRoom();
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [wishes, setWishes] = useState<DrinkWishlistItem[]>([]);
    const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const validateRoom = async () => {
            try {
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
        fetchDrinks();
        fetchWishes();
    }, [room?.id, navigate]);

    const fetchDrinks = async () => {
        if (!room?.id) return;
        try {
            const response = await getDrinks(room.id);
            setDrinks(response.data);
        } catch (error) {
            console.error('Error fetching drinks:', error);
            toast.error('Failed to fetch drinks');
        }
    };

    const fetchWishes = async () => {
        if (!room?.id) return;
        try {
            const response = await getDrinkWishes(room.id);
            setWishes(response.data);
        } catch (error) {
            console.error('Error fetching drink wishes:', error);
            toast.error('Failed to fetch drink wishes');
        }
    };

    const handleDrinkSubmit = async (drink: Omit<Drink, 'id' | 'created_at'>) => {
        if (!room?.id) return;
        try {
            await createDrink(drink);
            await fetchDrinks();
            toast.success('Drink added successfully!');
        } catch (error) {
            console.error('Failed to create drink:', error);
            toast.error('Failed to add drink');
        }
    };

    const handleDrinkEdit = async (id: number, updatedDrink: Omit<Drink, 'id'>) => {
        if (!room?.id) return;
        try {
            await updateDrink(room.id, id, updatedDrink);
            await fetchDrinks();
            toast.success('Drink updated successfully!');
        } catch (error) {
            console.error('Failed to update drink:', error);
            toast.error('Failed to update drink');
        }
    };

    const handleDrinkDelete = async (id: number) => {
        if (!room?.id) return;
        try {
            await deleteDrink(room.id, id);
            await fetchDrinks();
            toast.success('Drink deleted successfully!');
        } catch (error) {
            console.error('Error deleting drink:', error);
            toast.error('Failed to delete drink');
        }
    };

    const handleWishSubmit = async (wish: Omit<DrinkWishlistItem, 'id' | 'created_at'>) => {
        if (!room?.id) return;
        try {
            await createDrinkWish(wish);
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
            await deleteDrinkWish(room.id, id);
            await fetchWishes();
            toast.success('Wish deleted successfully!');
        } catch (error) {
            console.error('Error deleting wish:', error);
            toast.error('Failed to delete wish');
        }
    };

    const handleWishResolve = async (wish: DrinkWishlistItem, drink: Omit<Drink, 'id' | 'created_at'>) => {
        if (!room?.id) return;
        try {
            await createDrink({ ...drink, room_id: room.id });
            await deleteDrinkWish(room.id, wish.id);
            await Promise.all([fetchDrinks(), fetchWishes()]);
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
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Easter Drinks</h2>
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <span className="text-lg font-medium text-gray-700">What drinks are you going to bring?</span>
                                <AddDrinkButton 
                                    onSubmit={handleDrinkSubmit}
                                    onOpenModal={handleModalOpen}
                                    onCloseModal={handleModalClose}
                                />
                            </div>
                            <DrinkList
                                drinks={drinks}
                                onEdit={handleDrinkEdit}
                                onDelete={handleDrinkDelete}
                            />
                        </div>
                        <div className="lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-10 bg-gradient-to-b from-[#F2E6FF] to-white/90 rounded-xl p-6 transition-shadow hover:shadow-lg h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Drinks Wishlist</h2>
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <span className="text-lg font-medium text-gray-700">Make a special request!</span>
                                <DrinkWishForm 
                                    onSubmit={handleWishSubmit}
                                    onOpenModal={handleModalOpen}
                                    onCloseModal={handleModalClose}
                                />
                            </div>
                            <div className="mt-6">
                                <DrinkWishlistDisplay
                                    wishes={wishes}
                                    onDelete={handleWishDelete}
                                    onResolve={handleWishResolve}
                                />
                            </div>
                        </div>
                        <div className={`lg:col-span-2 ${!isModalOpen ? 'lg:border-l lg:border-gray-200' : ''} lg:pl-10 p-6 sticky top-4`}>
                            <DrinkTotalsByType drinks={drinks} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}; 