import React from 'react';
import { Icon } from './Icon';
import type { Task, TaskCategory, TaskStatus } from '../types';

interface TaskCardProps {
    task: Task;
    onSelectTask: (task: Task) => void;
    onShowMap: (location: string) => void;
}

const categoryStyles: { [key in TaskCategory]: { bg: string; text: string; icon: React.ComponentProps<typeof Icon>['name'] } } = {
    '家務助理': { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'home' },
    '簡易維修': { bg: 'bg-orange-100', text: 'text-orange-800', icon: 'wrench' },
    '陪伴關懷': { bg: 'bg-rose-100', text: 'text-rose-800', icon: 'heart' },
    '跑腿代辦': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: 'zap' },
};

const statusStyles: { [key in Exclude<TaskStatus, 'Open'>]: { text: string; bg: string; text_color: string; icon: React.ComponentProps<typeof Icon>['name']; icon_color: string } } = {
    'In Progress': { text: '進行中', bg: 'bg-blue-100', text_color: 'text-blue-800', icon: 'loader', icon_color: 'text-blue-600' },
    'Completed': { text: '已完成', bg: 'bg-slate-200', text_color: 'text-slate-700', icon: 'checkCircle', icon_color: 'text-slate-600' },
    'Cancelled': { text: '已取消', bg: 'bg-red-100', text_color: 'text-red-800', icon: 'xCircle', icon_color: 'text-red-600' },
};


export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelectTask, onShowMap }) => {
    const style = categoryStyles[task.category] || { bg: 'bg-slate-100', text: 'text-slate-800', icon: 'help' };
    
    return (
        <div 
            onClick={() => onSelectTask(task)}
            className="relative bg-white p-5 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
        >
            {task.status !== 'Open' && (
                <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    {(() => {
                        const statusStyle = statusStyles[task.status as Exclude<TaskStatus, 'Open'>];
                        if (!statusStyle) return null;
                        return (
                            <div className={`flex items-center px-4 py-2 rounded-full ${statusStyle.bg} ${statusStyle.text_color} font-semibold`}>
                                <Icon 
                                    name={statusStyle.icon} 
                                    className={`h-5 w-5 mr-2 ${statusStyle.icon_color} ${task.status === 'In Progress' ? 'animate-spin' : ''}`} 
                                />
                                {statusStyle.text}
                            </div>
                        )
                    })()}
                </div>
            )}
            <div>
                 <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                        <Icon name={style.icon} className="h-4 w-4 mr-1.5" />
                        {task.category}
                    </span>
                    {task.requiresCertification && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                             <Icon name="shield" className="h-4 w-4 mr-1.5" />
                            需認證
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">{task.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{task.description}</p>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold text-emerald-600">
                        NT$ {task.reward}
                    </div>
                     <div className="flex items-center text-sm text-slate-500">
                         <Icon name="clock" className="h-4 w-4 mr-1.5 text-slate-400" />
                        <span title="預計完成時間">{task.estimatedDuration}</span>
                    </div>
                </div>

                {task.deadline && (
                    <div className="flex items-center text-sm text-rose-600 font-medium mb-4 -mt-2">
                        <Icon name="calendar" className="h-4 w-4 mr-1.5" />
                        <span>截止: {new Date(task.deadline).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                )}

                <div className="flex items-center text-sm text-slate-500 mb-4 min-w-0">
                    <Icon name="mapPin" className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span className="truncate" title={task.location}>{task.location}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShowMap(task.location);
                        }}
                        className="ml-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                        aria-label="顯示地圖"
                        title="顯示地圖"
                    >
                        <Icon name="map" className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </button>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={`https://picsum.photos/seed/${task.posterName}/40/40`}
                            alt={task.posterName}
                            className="h-8 w-8 rounded-full mr-3"
                        />
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-700">{task.posterName}</span>
                            {task.posterIsCertified && (
                                <div title={task.posterCertificationOrg ? `由 ${task.posterCertificationOrg} 認證` : '認證幫手'} className="ml-1.5">
                                    <Icon name="shield-check" className="h-4 w-4 text-emerald-500" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-yellow-500">
                         {[...Array(5)].map((_, i) => (
                            <Icon key={i} name="star" className={`h-4 w-4 ${i < task.posterTrustScore ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};