import axios from 'axios';
import { Dish, Family, Member, WishlistItem, FamilyAffiliation, MealType } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Dishes
export const getDishes = () => api.get<Dish[]>('/dishes/');
export const getDish = (id: number) => api.get<Dish>(`/dishes/${id}`);
export const createDish = (dish: Omit<Dish, 'id'>) => api.post<Dish>('/dishes/', dish);
export const updateDish = (id: number, dish: Partial<Dish>) => api.put<Dish>(`/dishes/${id}`, dish);
export const deleteDish = (id: number) => api.delete(`/dishes/${id}`);

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
export const getWishlistItems = () => api.get<WishlistItem[]>('/wishlist/');
export const createWishlistItem = (item: Omit<WishlistItem, 'id'>) => api.post<WishlistItem>('/wishlist/', item);
export const deleteWishlistItem = (id: number) => api.delete(`/wishlist/${id}`); 