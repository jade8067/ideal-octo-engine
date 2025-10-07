import React from 'react';
import { Icon } from './Icon';
import type { Task, TaskCategory, User, TaskStatus } from '../types';

interface TaskDetailModalProps {
    task: Task;
    currentUser: User;
    onClose: () => void;
    onAcceptTask: (taskId: string) => void;
    onEditTask: (task: Task) => void;
    onCancelTask: (taskId: string) => void;
    onShowMap: (location: string) => void;
}

const categoryStyles: { [key in TaskCategory]: { bg: string; text: string; icon: React.ComponentProps<typeof Icon>['name'] } } = {
    '家務助理': { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'home' },
    '簡易維修': { bg: 'bg-orange-100', text: 'text-orange-800', icon: 'wrench' },
    '陪伴關懷': { bg: 'bg-rose-100', text: 'text-rose-800', icon: 'heart' },
    '跑腿代辦': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: 'zap' },
};

const statusStyles: { [key in TaskStatus]: { text: string; bg: string; text_color: string; icon: React.ComponentProps<typeof Icon>['name']; icon_color: string } } = {
    'Open': { text: '開放中', bg: 'bg-emerald-100', text_color: 'text-emerald-800', icon: 'unlock', icon_color: 'text-emerald-600' },
    'In Progress': { text: '進行中', bg: 'bg-blue-100', text_color: 'text-blue-800', icon: 'loader', icon_color: 'text-blue-600' },
    'Completed': { text: '已完成', bg: 'bg-slate-100', text_color: 'text-slate-800', icon: 'checkCircle', icon_color: 'text-slate-600' },
    'Cancelled': { text: '已取消', bg: 'bg-red-100', text_color: 'text-red-800', icon: 'xCircle', icon_color: 'text-red-600' },
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, currentUser, onClose, onAcceptTask, onEditTask, onCancelTask, onShowMap }) => {
    const categoryStyle = categoryStyles[task.category];
    const statusStyle = statusStyles[task.status];
    const isPoster = currentUser.name === task.posterName;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
                                    <Icon name={categoryStyle.icon} className="h-4 w-4 mr-2" />
                                    {task.category}
                                </span>
                                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text_color}`}>
                                    <Icon 
                                      name={statusStyle.icon} 
                                      className={`h-4 w-4 mr-2 ${statusStyle.icon_color} ${task.status === 'In Progress' ? 'animate-spin' : ''}`} 
                                    />
                                    {statusStyle.text}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">{task.title}</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <Icon name="close" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                
                <div className="px-6 pb-6 border-b border-slate-200">
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center text-slate-600">
                            <Icon name="dollarSign" className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-semibold">獎勵</p>
                                <p className="text-lg font-bold text-emerald-600">NT$ {task.reward}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-slate-600">
                            <Icon name="clock" className="h-5 w-5 mr-3 text-indigo-500" />
                            <div>
                                <p className="font-semibold">預計耗時</p>
                                <p>{task.estimatedDuration}</p>
                            </div>
                        </div>
                        {task.deadline && (
                             <div className="flex items-center text-slate-600">
                                <Icon name="calendar" className="h-5 w-5 mr-3 text-rose-500" />
                                <div>
                                    <p className="font-semibold">任務截止</p>
                                    <p>{new Date(task.deadline).toLocaleString('zh-TW', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start text-slate-600">
                            <Icon name="mapPin" className="h-5 w-5 mr-3 text-rose-500 mt-1" />
                            <div className="flex-grow">
                                <p className="font-semibold">地點</p>
                                <p className="break-words">{task.location}</p>
                                <button
                                    onClick={() => onShowMap(task.location)}
                                    className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 mt-2 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    <Icon name="map" className="h-4 w-4 mr-2" />
                                    顯示地圖
                                </button>
                            </div>
                        </div>
                    </div>
                     {task.requiresCertification && (
                        <div className="mt-4 flex items-center p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                            <Icon name="shield" className="h-5 w-5 mr-3 flex-shrink-0" />
                            <p>此任務需要經過社福認證的幫手才能接單，以確保服務品質與安全。</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-6">
                    <h3 className="font-semibold text-slate-800 mb-2">任務詳情</h3>
                    <p className="text-slate-600 whitespace-pre-wrap">{task.description}</p>
                </div>
                
                <div className="px-6 py-6 bg-slate-50">
                     <h3 className="font-semibold text-slate-800 mb-4">發布者資訊</h3>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <img src={`https://picsum.photos/seed/${task.posterName}/48/48`} alt={task.posterName} className="h-12 w-12 rounded-full mr-4" />
                            <div>
                                <div className="flex items-center">
                                    <p className="font-bold text-slate-800">{task.posterName}</p>
                                    {task.posterIsCertified && (
                                        <div title={task.posterCertificationOrg ? `由 ${task.posterCertificationOrg} 認證` : '認證幫手'} className="ml-2">
                                            <Icon name="shield-check" className="h-5 w-5 text-emerald-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center text-sm text-yellow-500 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon key={i} name="star" className={`h-4 w-4 ${i < task.posterTrustScore ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                                    ))}
                                    <span className="ml-2 text-slate-500 font-medium">{task.posterTrustScore}.0</span>
                                </div>
                            </div>
                        </div>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-emerald-600 border border-emerald-300 hover:bg-emerald-50">
                           <Icon name="message" className="h-4 w-4 mr-2" />
                           聯絡他
                        </button>
                    </div>
                </div>

                <div className="p-6 sticky bottom-0 bg-white border-t border-slate-200">
                    {isPoster ? (
                        <div className="flex w-full items-center space-x-2">
                             {task.status === 'Open' && (
                                <button
                                    onClick={() => onEditTask(task)}
                                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-semibold text-white h-12 px-4 py-2 shadow-sm transition-transform bg-slate-600 hover:bg-slate-700 hover:scale-[1.02]"
                                >
                                    <Icon name="edit" className="h-5 w-5 mr-2" />
                                    編輯
                                </button>
                            )}
                             {(task.status === 'Open' || task.status === 'In Progress') && (
                                <button
                                    onClick={() => onCancelTask(task.id)}
                                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-semibold text-white h-12 px-4 py-2 shadow-sm transition-transform bg-red-500 hover:bg-red-600 hover:scale-[1.02]"
                                >
                                    <Icon name="xCircle" className="h-5 w-5 mr-2" />
                                    取消任務
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => onAcceptTask(task.id)}
                            disabled={task.status !== 'Open'}
                            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-semibold text-white h-12 px-4 py-2 shadow-sm transition-transform disabled:bg-slate-400 disabled:cursor-not-allowed enabled:bg-emerald-500 enabled:hover:bg-emerald-600 enabled:hover:scale-[1.02]"
                        >
                            {task.status === 'Open' && '接受任務'}
                            {task.status === 'In Progress' && (
                                <>
                                    <Icon name="checkCircle" className="h-6 w-6 mr-2" />
                                    任務進行中
                                </>
                            )}
                            {task.status === 'Completed' && '任務已完成'}
                            {task.status === 'Cancelled' && '任務已取消'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};