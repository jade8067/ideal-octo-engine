import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import type { Task, TaskCategory, TaskDuration } from '../types';

interface TaskFormModalProps {
    onClose: () => void;
    onAddTask: (task: Omit<Task, 'id' | 'posterName' | 'posterTrustScore' | 'posterIsCertified' | 'status' | 'posterCertificationOrg'>) => void;
    onUpdateTask: (task: Task) => void;
    taskToEdit: Task | null;
}

const categories: TaskCategory[] = ['跑腿代辦', '家務助理', '簡易維修', '陪伴關懷'];
const durations: TaskDuration[] = ['30分鐘', '1小時', '2小時', '半天'];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ onClose, onAddTask, onUpdateTask, taskToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TaskCategory>('跑腿代辦');
    const [reward, setReward] = useState<string>('');
    const [location, setLocation] = useState('');
    const [requiresCertification, setRequiresCertification] = useState(false);
    const [estimatedDuration, setEstimatedDuration] = useState<TaskDuration>('1小時');
    const [deadline, setDeadline] = useState('');
    
    const isEditing = taskToEdit !== null;

    useEffect(() => {
        if (isEditing) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setCategory(taskToEdit.category);
            setReward(taskToEdit.reward.toString());
            setLocation(taskToEdit.location);
            setRequiresCertification(taskToEdit.requiresCertification);
            setEstimatedDuration(taskToEdit.estimatedDuration);
            setDeadline(taskToEdit.deadline || '');
        }
    }, [taskToEdit, isEditing]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !reward || !location) {
            alert('請填寫所有必填欄位');
            return;
        }
        
        const taskData = {
            title,
            description,
            category,
            reward: parseInt(reward, 10),
            location,
            requiresCertification,
            estimatedDuration,
            deadline: deadline || undefined,
        };

        if (isEditing) {
            onUpdateTask({
                ...taskToEdit,
                ...taskData,
            });
        } else {
            onAddTask(taskData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditing ? '編輯任務' : '發布一個新任務'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <Icon name="close" className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">任務標題</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">詳細說明</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required></textarea>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">預計耗時</label>
                             <div className="flex space-x-2">
                                {durations.map((duration) => (
                                    <button
                                        type="button"
                                        key={duration}
                                        onClick={() => setEstimatedDuration(duration)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex-1 text-center ${estimatedDuration === duration ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                                    >
                                        {duration}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">任務類別</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="reward" className="block text-sm font-medium text-slate-700 mb-1">獎勵金額 (NT$)</label>
                                <input type="number" id="reward" value={reward} onChange={e => setReward(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">地點</label>
                                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required placeholder="例如：台北市中山區" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-1">任務截止時間 (選填)</label>
                            <input type="datetime-local" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="certification" checked={requiresCertification} onChange={e => setRequiresCertification(e.target.checked)} className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                            <label htmlFor="certification" className="ml-2 block text-sm text-slate-900">僅限社福認證幫手</label>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                         <button type="submit" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 h-12 px-4 py-2 shadow-sm">
                            {isEditing ? '儲存變更' : '確認發布'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};