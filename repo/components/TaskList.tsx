

import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskCategory } from '../types';
import { Icon } from './Icon';

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    onSelectTask: (task: Task) => void;
    onShowMap: (location: string) => void;
}

const categories: TaskCategory[] = ['家務助理', '簡易維修', '陪伴關懷', '跑腿代辦'];

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-emerald-100 rounded-full w-24"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="flex items-center text-sm text-slate-500">
            <div className="h-6 w-6 bg-slate-200 rounded-full mr-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
    </div>
);


export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, onSelectTask, onShowMap }) => {
    const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
    const [minTrustScore, setMinTrustScore] = useState<number>(1);
    const [certificationFilter, setCertificationFilter] = useState<'all' | 'required' | 'not-required'>('all');
    const [sortOrder, setSortOrder] = useState<'default' | 'reward-asc' | 'reward-desc'>('default');

    const processedTasks = tasks
        .filter(task => {
            const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
            const trustScoreMatch = task.posterTrustScore >= minTrustScore;
            const certificationMatch = certificationFilter === 'all'
                || (certificationFilter === 'required' && task.requiresCertification)
                || (certificationFilter === 'not-required' && !task.requiresCertification);
            return categoryMatch && trustScoreMatch && certificationMatch;
        })
        .sort((a, b) => {
            if (sortOrder === 'reward-asc') {
                return a.reward - b.reward;
            }
            if (sortOrder === 'reward-desc') {
                return b.reward - a.reward;
            }
            return 0; // 'default' order preserves the original order (e.g., chronological)
        });
    
    return (
        <div>
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                    <div className="lg:col-span-2">
                        <label htmlFor="trustScore" className="block text-sm font-medium text-slate-700 mb-1">
                            最低信任分數
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="range"
                                id="trustScore"
                                min="1"
                                max="5"
                                step="1"
                                value={minTrustScore}
                                onChange={(e) => setMinTrustScore(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                aria-label="Minimum trust score"
                            />
                             <div className="flex items-center justify-center bg-slate-100 rounded-md w-12 h-8 flex-shrink-0">
                                <span className="font-semibold text-emerald-600 text-sm">{minTrustScore}</span>
                                <Icon name="star" className="h-4 w-4 text-yellow-400 fill-current ml-1"/>
                             </div>
                        </div>
                    </div>
                     <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                           需要社福認證
                        </label>
                         <div className="flex space-x-2">
                            {(['all', 'required', 'not-required'] as const).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setCertificationFilter(option)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex-1 text-center ${certificationFilter === option ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                                >
                                    {option === 'all' ? '全部' : option === 'required' ? '需要' : '不需要'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            獎勵排序
                        </label>
                         <div className="flex space-x-2">
                            {(['default', 'reward-desc', 'reward-asc'] as const).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setSortOrder(option)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex-1 text-center ${sortOrder === option ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                                >
                                    {option === 'default' ? '預設' : option === 'reward-desc' ? '高 > 低' : '低 > 高'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === 'all' ? 'bg-emerald-500 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                >
                    全部
                </button>
                {categories.map(category => (
                     <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${selectedCategory === category ? 'bg-emerald-500 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} />)
                ) : processedTasks.length > 0 ? (
                    processedTasks.map(task => (
                        <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} onShowMap={onShowMap} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-lg font-medium">哎呀！找不到符合條件的任務 😅</p>
                        <p className="text-slate-400 mt-2 text-sm">試著放寬篩選條件看看吧！</p>
                    </div>
                )}
            </div>
        </div>
    );
};
