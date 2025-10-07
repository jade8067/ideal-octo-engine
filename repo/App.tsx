import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { TaskDetailModal } from './components/TaskDetailModal';
import { TaskFormModal } from './components/CreateTaskModal';
import { ProfileModal } from './components/ProfileModal';
import { TaskHistoryModal } from './components/TaskHistoryModal';
import { MapModal } from './components/MapModal';
import { generateSampleTasks } from './services/geminiService';
import type { Task, User } from './types';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [locationForMap, setLocationForMap] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const [currentUser, setCurrentUser] = useState<User>({
        name: '王小明',
        avatarSeed: 'ming-wang',
        bio: '我是一位熱心的退休教師，喜歡幫助鄰居解決生活中的大小事。',
        isCertified: true,
        certificationOrg: '衛生福利部社會及家庭署',
        trustScore: 5,
    });
    
    const loadTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (process.env.API_KEY) {
                const fetchedTasks = await generateSampleTasks();
                setTasks(fetchedTasks);
            } else {
                // Fallback to mock data if API key is not present
                console.warn("API key not found. Using mock data.");
                const mockData = await import('./mockData');
                setTasks(mockData.sampleTasks);
            }
        } catch (err) {
            console.error(err);
            setError('無法載入任務，請稍後再試。');
            const mockData = await import('./mockData');
            setTasks(mockData.sampleTasks);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleSelectTask = (task: Task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedTask(null);
    };

    const handleShowMap = (location: string) => {
        setLocationForMap(location);
        setIsMapModalOpen(true);
    };

    const handleCloseMap = () => {
        setIsMapModalOpen(false);
        setLocationForMap(null);
    };
    
    const openCreateModal = () => {
        setTaskToEdit(null);
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setTaskToEdit(null);
    };

    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);

    const openHistoryModal = () => setIsHistoryModalOpen(true);
    const closeHistoryModal = () => setIsHistoryModalOpen(false);

    const handleAddTask = (newTaskData: Omit<Task, 'id' | 'posterName' | 'posterTrustScore' | 'posterIsCertified' | 'status'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: new Date().getTime().toString(),
            posterName: currentUser.name,
            posterTrustScore: currentUser.trustScore,
            posterIsCertified: currentUser.isCertified,
            posterCertificationOrg: currentUser.certificationOrg,
            status: 'Open',
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
        closeCreateModal();
    };

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        closeCreateModal();
        if (selectedTask && selectedTask.id === updatedTask.id) {
            setSelectedTask(updatedTask);
        }
    };

    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setIsDetailModalOpen(false);
        setIsCreateModalOpen(true);
    };
    
    const handleAcceptTask = (taskId: string) => {
         setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: 'In Progress' } : task
            )
        );
        handleCloseDetailModal();
        // In a real app, you might want to show a confirmation
    };
    
    const handleCancelTask = (taskId: string) => {
         setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: 'Cancelled' } : task
            )
        );
        handleCloseDetailModal();
    };

    const handleUpdateUser = (updatedUser: User) => {
        setCurrentUser(updatedUser);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Header 
                user={currentUser} 
                onCreateTask={openCreateModal}
                onShowProfile={openProfileModal}
                onShowHistory={openHistoryModal}
            />
            <main className="container mx-auto p-4 md:p-6">
                <TaskList
                    tasks={tasks}
                    isLoading={isLoading}
                    onSelectTask={handleSelectTask}
                    onShowMap={handleShowMap}
                />
                {error && <div className="text-red-500 text-center mt-4">{error}</div>}
            </main>

            {isCreateModalOpen && (
                <TaskFormModal 
                    onClose={closeCreateModal} 
                    onAddTask={handleAddTask} 
                    onUpdateTask={handleUpdateTask}
                    taskToEdit={taskToEdit}
                />
            )}

            {isDetailModalOpen && selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    currentUser={currentUser}
                    onClose={handleCloseDetailModal}
                    onAcceptTask={handleAcceptTask}
                    onEditTask={handleEditTask}
                    onCancelTask={handleCancelTask}
                    onShowMap={handleShowMap}
                />
            )}

            {isProfileModalOpen && (
                 <ProfileModal 
                    user={currentUser}
                    onClose={closeProfileModal}
                    onUpdateUser={handleUpdateUser}
                />
            )}

            {isHistoryModalOpen && (
                 <TaskHistoryModal 
                    isOpen={isHistoryModalOpen}
                    onClose={closeHistoryModal}
                    tasks={tasks}
                    currentUser={currentUser}
                />
            )}

            {isMapModalOpen && locationForMap && (
                <MapModal location={locationForMap} onClose={handleCloseMap} />
            )}
        </div>
    );
};

export default App;