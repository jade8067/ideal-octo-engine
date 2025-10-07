import React, { useState } from 'react';
import { Icon } from './Icon';
import type { Task, User, TaskCategory } from '../types';

interface TaskHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    currentUser: User;
}

const categoryStyles: { [key in TaskCategory]: { icon: React.ComponentProps<typeof Icon>['name'], color: string } } = {
    '家務助理': { icon: 'home', color: 'text-blue-500' },
    '簡易維修': { icon: 'wrench', color: 'text-orange-500' },
    '陪伴關懷': { icon: 'heart', color: 'text-rose-500' },
    '跑腿代辦': { icon: 'zap', color: 'text-indigo-500' },
};


const TaskHistoryItem: React.FC<{ task: Task }> = ({ task }) => {
    const categoryStyle = categoryStyles[task.category];
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="flex items-center">
                <div className={`mr-3 p-2 bg-white rounded-full shadow-sm ${categoryStyle.color}`}>
                     <Icon name={categoryStyle.icon} className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold text-slate-800">{task.title}</p>
                    <p className="text-sm text-slate-500">{task.category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-emerald-600">NT$ {task.reward}</p>
                <p className={`text-sm font-semibold ${task.status === 'Completed' ? 'text-slate-500' : 'text-red-500'}`}>
                    {task.status === 'Completed' ? '已完成' : '已取消'}
                </p>
            </div>
        </div>
    );
}

export const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({ isOpen, onClose, tasks, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'completed' | 'cancelled'>('completed');

    if (!isOpen) {
        return null;
    }

    const postedTasks = tasks.filter(task => task.posterName === currentUser.name);
    const completedTasks = postedTasks.filter(task => task.status === 'Completed');
    const cancelledTasks = postedTasks.filter(task => task.status === 'Cancelled');

    const tasksToShow = activeTab === 'completed' ? completedTasks : cancelledTasks;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">我的任務歷史</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <Icon name="close" className="h-6 w-6" />
                    </button>
                </div>

                <div className="border-b border-slate-200">
                    <nav className="flex space-x-2 p-2" aria-label="Tabs">
                         <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
                                activeTab === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            已完成 ({completedTasks.length})
                        </button>
                         <button
                            onClick={() => setActiveTab('cancelled')}
                             className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
                                activeTab === 'cancelled' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            已取消 ({cancelledTasks.length})
                        </button>
                    </nav>
                </div>

                <div className="p-6 overflow-y-auto">
                    {tasksToShow.length > 0 ? (
                        <div className="space-y-3">
                            {tasksToShow.map(task => <TaskHistoryItem key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg font-medium">
                                {activeTab === 'completed' ? '還沒有完成的任務喔！' : '太棒了，沒有取消的任務！'}
                            </p>
                            <p className="text-slate-400 mt-2 text-sm">
                                {activeTab === 'completed' ? '快去看看有沒有可以幫忙的吧！' : '繼續保持！'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};