export interface Dish {
    id?: number;
    name: string;
    quantity: number;
    member_id: number;
    fullName: string;
    meal_type: string;
}

export interface Member {
    id?: number;
    name: string;
    family_id: number;
    dishes?: Dish[];
}

export interface Family {
    id?: number;
    name: string;
    members?: Member[];
}

export interface WishlistItem {
    id?: number;
    dish_name: string;
    requested_quantity: number;
    notes?: string;
}

export interface FamilyAffiliation {
    id: number;
    name: string;
}

export interface MealType {
    id: number;
    name: string;
} 