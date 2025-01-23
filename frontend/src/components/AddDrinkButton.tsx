import React from 'react';
import { Dialog } from '@headlessui/react';
import { DrinkForm } from './DrinkForm';
import { Modal } from './Modal';

interface AddDrinkButtonProps {
    onSubmit: (drink: any) => void;
    onOpenModal: () => void;
    onCloseModal: () => void;
}

export const AddDrinkButton: React.FC<AddDrinkButtonProps> = ({
    onSubmit,
    onOpenModal,
    onCloseModal,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSubmit = (drink: any) => {
        onSubmit(drink);
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
        onOpenModal();
    };

    const handleClose = () => {
        setIsOpen(false);
        onCloseModal();
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add New Drink
            </button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                    Add New Drink
                </Dialog.Title>
                <DrinkForm
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                />
            </Modal>
        </>
    );
}; 