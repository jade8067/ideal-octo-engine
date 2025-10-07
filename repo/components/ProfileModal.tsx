import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import type { User } from '../types';

interface ProfileModalProps {
    user: User;
    onClose: () => void;
    onUpdateUser: (user: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">個人資料</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <Icon name="close" className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <img
                            src={`https://picsum.photos/seed/${formData.avatarSeed}/128/128`}
                            alt={`${formData.name} 的頭像`}
                            className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-slate-200"
                        />
                         {!isEditing && (
                            <>
                                <h3 className="text-2xl font-bold text-slate-800">{formData.name}</h3>
                                <p className="text-slate-500 mt-2">{formData.bio}</p>
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">您的名字</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                             <div>
                                <label htmlFor="avatarSeed" className="block text-sm font-medium text-slate-700 mb-1">頭像種子</label>
                                <input
                                    type="text"
                                    id="avatarSeed"
                                    name="avatarSeed"
                                    value={formData.avatarSeed}
                                    onChange={handleInputChange}
                                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="輸入任何文字來更換頭像"
                                />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">個人簡介</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                ></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-sm text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Icon key={i} name="star" className={`h-5 w-5 ${i < user.trustScore ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                                ))}
                                <span className="ml-2 text-slate-500 font-medium">{user.trustScore}.0 信任分數</span>
                            </div>

                            {user.isCertified && user.certificationOrg && (
                                <div className="flex items-center p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                                    <Icon name="shield-check" className="h-6 w-6 mr-3 flex-shrink-0 text-emerald-500" />
                                    <div>
                                        <p className="font-semibold">已認證幫手</p>
                                        <p className="text-xs">由 {user.certificationOrg} 認證</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex space-x-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-semibold text-white bg-emerald-500 hover:bg-emerald-600 h-11 px-4 py-2 shadow-sm">
                                儲存變更
                            </button>
                             <button onClick={handleCancel} className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 h-11 px-4 py-2">
                                取消
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-semibold text-white bg-emerald-500 hover:bg-emerald-600 h-11 px-4 py-2 shadow-sm">
                            編輯個人資料
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
