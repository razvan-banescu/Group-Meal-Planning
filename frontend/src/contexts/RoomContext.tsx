import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room } from '../types';

interface RoomContextType {
    room: Room | null;
    setRoom: (room: Room | null) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [room, setRoom] = useState<Room | null>(() => {
        const savedRoom = localStorage.getItem('currentRoom');
        return savedRoom ? JSON.parse(savedRoom) : null;
    });

    useEffect(() => {
        if (room) {
            localStorage.setItem('currentRoom', JSON.stringify(room));
        } else {
            localStorage.removeItem('currentRoom');
        }
    }, [room]);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context;
};

export default RoomContext; 