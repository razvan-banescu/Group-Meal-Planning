export interface RoomSettings {
    participantCount: number;
    mealCount: number;
    language: string;
    families: string[];
    mealTypes: string[];
    selectedTypes: string[];  // The actual meal types (Entree, Main Course, Desert)
}

export interface Room {
    id: number;
    seed: string;
    status: 'pending' | 'active';
    settings?: RoomSettings;
    created_at: string;
}

export interface Dish {
    id: number;
    name: string;
    quantity: number;
    fullName: string;
    meal_type: string;
    member_id: number;
    room_id: number;
}

export interface Member {
    id: number;
    name: string;
    family_id: number;
}

export interface Family {
    id: number;
    name: string;
}

export interface WishlistItem {
    id: number;
    dish_name: string;
    requested_quantity: number;
    notes?: string;
    room_id: number;
}

export interface DrinkWishlistItem {
    id: number;
    drink_name: string;
    brand?: string;
    description?: string;
    requested_from?: string;
    requested_quantity: number;
    room_id: number;
    created_at: string;
}

export interface FamilyAffiliation {
    id: number;
    name: string;
}

export interface MealType {
    id: number;
    name: string;
}

export interface Drink {
    id: number;
    fullName: string;
    category: string;
    other_category?: string;
    brand?: string;
    quantity: number;
    member_id: number;
    room_id: number;
    created_at: string;
} 