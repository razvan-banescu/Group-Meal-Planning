import React from 'react';
import { Dialog } from '@headlessui/react';
import { Modal } from './Modal';
import { DrinkForm } from './DrinkForm';
import { DrinkWishlistItem, Drink } from '../types';

interface DrinkResolveWishDialogProps {
    wish: DrinkWishlistItem | null;
    onClose: () => void;
    onResolve: (drink: Omit<Drink, 'id' | 'created_at'>) => void;
}

export const DrinkResolveWishDialog: React.FC<DrinkResolveWishDialogProps> = ({
    wish,
    onClose,
    onResolve,
}) => {
    if (!wish) return null;

    return (
        <Modal isOpen={!!wish} onClose={onClose}>
            <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                        Resolve Drink Wish
                    </Dialog.Title>
                    <div className="mt-2 mb-4">
                        <p className="text-sm text-gray-500">
                            You are resolving the wish for {wish.drink_name}.
                            {wish.requested_from && ` This was requested from ${wish.requested_from}.`}
                        </p>
                    </div>
                    <DrinkForm
                        onSubmit={onResolve}
                        onCancel={onClose}
                        submitButtonText="Resolve Wish"
                        initialValues={{
                            fullName: wish.drink_name,
                            category: '',
                            quantity: wish.requested_quantity,
                            brand: wish.brand,
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
}; 