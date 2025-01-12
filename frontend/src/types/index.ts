export interface RoomSettings {
    participantCount: number;
    mealCount: number;
    language: string;
    families: string[];
    mealType: 'default' | 'large' | 'drinks';
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

export interface FamilyAffiliation {
    id: number;
    name: string;
}

export interface MealType {
    id: number;
    name: string;
} 