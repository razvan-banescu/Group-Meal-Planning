import axios from 'axios';
import { Dish, Family, Member, WishlistItem, FamilyAffiliation, MealType, Room, RoomSettings, Drink, DrinkWishlistItem } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Rooms
export const createRoom = () => api.post<Room>('/rooms/', {});
export const activateRoom = (seed: string, settings: RoomSettings) => 
    api.put<Room>(`/rooms/${seed}/activate`, { settings });
export const getRoom = (seed: string) => api.get<Room>(`/rooms/${seed}`);
export const getRoomStatus = (seed: string) => 
    api.get<{ status: 'pending' | 'active' }>(`/rooms/${seed}/status`);

// Dishes
export const getDishes = (roomId: number) => api.get<Dish[]>(`/dishes/${roomId}`);
export const getDish = (roomId: number, id: number) => api.get<Dish>(`/dishes/${roomId}/${id}`);
export const createDish = (dish: Omit<Dish, 'id'>) => api.post<Dish>(`/dishes/${dish.room_id}`, dish);
export const updateDish = (roomId: number, id: number, dish: Partial<Dish>) => 
    api.put<Dish>(`/dishes/${roomId}/${id}`, dish);
export const deleteDish = (roomId: number, id: number) => 
    api.delete(`/dishes/${roomId}/${id}`);

// Families
export const getFamilies = () => api.get<Family[]>('/families/');
export const getFamily = (id: number) => api.get<Family>(`/families/${id}`);
export const createFamily = (family: Omit<Family, 'id'>) => api.post<Family>('/families/', family);
export const updateFamily = (id: number, family: Partial<Family>) => api.put<Family>(`/families/${id}`, family);
export const deleteFamily = (id: number) => api.delete(`/families/${id}`);

// Members
export const getMembers = () => api.get<Member[]>('/members/');
export const getMember = (id: number) => api.get<Member>(`/members/${id}`);
export const createMember = (member: Omit<Member, 'id'>) => api.post<Member>('/members/', member);
export const updateMember = (id: number, member: Partial<Member>) => api.put<Member>(`/members/${id}`, member);
export const deleteMember = (id: number) => api.delete(`/members/${id}`);

// Family Affiliations
export const getFamilyAffiliations = () => api.get<FamilyAffiliation[]>('/affiliations/');

// Meal Types
export const getMealTypes = () => api.get<MealType[]>('/meal-types/');

// Wishlist
export const getWishlistItems = (roomId: number) => api.get<WishlistItem[]>(`/wishlist/${roomId}`);
export const createWishlistItem = (item: Omit<WishlistItem, 'id'>) => api.post<WishlistItem>('/wishlist/', item);
export const deleteWishlistItem = (roomId: number, id: number) => api.delete(`/wishlist/${roomId}/${id}`);

// Drinks
export const getDrinks = (roomId: number) => api.get<Drink[]>(`/drinks/${roomId}`);
export const getDrink = (roomId: number, id: number) => api.get<Drink>(`/drinks/${roomId}/${id}`);
export const createDrink = (drink: Omit<Drink, 'id' | 'created_at'>) => api.post<Drink>('/drinks/', drink);
export const updateDrink = (roomId: number, id: number, drink: Partial<Drink>) => 
    api.put<Drink>(`/drinks/${roomId}/${id}`, drink);
export const deleteDrink = (roomId: number, id: number) => 
    api.delete(`/drinks/${roomId}/${id}`);
export const getDrinkCategories = () => api.get<MealType[]>('/drinks/categories');

// Drink Wishlist
export const getDrinkWishes = (roomId: number) => api.get<DrinkWishlistItem[]>(`/drink-wishlist/${roomId}`);
export const createDrinkWish = (wish: Omit<DrinkWishlistItem, 'id' | 'created_at'>) => 
    api.post<DrinkWishlistItem>('/drink-wishlist/', wish);
export const deleteDrinkWish = (roomId: number, id: number) => 
    api.delete(`/drink-wishlist/${roomId}/${id}`); 