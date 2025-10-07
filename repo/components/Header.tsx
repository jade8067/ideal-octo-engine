import React from 'react';
import type { User } from '../types';
import { Icon } from './Icon';
import { Logo } from './Logo';

interface HeaderProps {
    user: User;
    onShowProfile: () => void;
    onShowHistory: () => void;
    onCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onShowProfile, onShowHistory, onCreateTask }) => {
    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Logo className="h-8 w-8" />
                        <h1 className="text-xl font-bold text-slate-800">鄰里幫</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={onShowHistory} className="relative text-slate-500 hover:text-emerald-600 transition p-2 rounded-full hover:bg-slate-200" aria-label="任務歷史">
                            <Icon name="history" className="h-6 w-6" />
                        </button>
                        <button onClick={onShowProfile} className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-200 transition">
                            <img
                                src={`https://picsum.photos/seed/${user.avatarSeed}/40/40`}
                                alt={user.name}
                                className="h-8 w-8 rounded-full"
                            />
                        </button>
                         <button
                            onClick={onCreateTask}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 h-10 px-5 py-2 shadow-sm transition-transform hover:scale-105"
                        >
                            刊登任務
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
