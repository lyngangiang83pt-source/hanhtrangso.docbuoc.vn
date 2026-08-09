import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Các Module Giao diện
import { HomeView } from './features/home/HomeView';
import { NewsView } from './features/news/NewsView';
import { GamesView } from './features/games/GamesView';
import { ResourcesView } from './features/digital-resources/ResourcesView';
import { LecturesView } from './features/lectures/LecturesView';
import { AssignmentsView } from './features/assignments/AssignmentsView';
import { StudentProductsView } from './features/student-products/StudentProductsView';
import { AiQaView } from './features/ai-qa/AiQaView';
import { VipVaultView } from './features/vip-vault/VipVaultView';
import { NotificationsView } from './features/notifications/NotificationsView';
import { ClassroomManager } from './features/classroom/ClassroomManager';
import { SubjectManager } from './features/classroom/SubjectManager';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AuthModal } from './features/auth/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* HEADER & NAVIGATION BAR */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenAuthModal={() => setIsAuthModalOpen(true)} 
        />

        {/* NỘI DUNG CHÍNH (MAIN VIEW AREA) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} onOpenAuthModal={() => setIsAuthModalOpen(true)} />}
          {activeTab === 'news' && <NewsView />}
          {activeTab === 'games' && <GamesView />}
          {activeTab === 'resources' && <ResourcesView />}
          {activeTab === 'lectures' && <LecturesView />}
          {activeTab === 'assignments' && <AssignmentsView />}
          {activeTab === 'student-products' && <StudentProductsView />}
          {activeTab === 'ai-qa' && <AiQaView />}
          {activeTab === 'vip-vault' && <VipVaultView />}
          {activeTab === 'notifications' && <NotificationsView />}
          {activeTab === 'classroom' && <ClassroomManager />}
          {activeTab === 'subjects' && <SubjectManager />}
          {activeTab === 'admin' && <AdminDashboard />}
        </main>

        {/* CHÂN TRANG (FOOTER) */}
        <Footer />

        {/* MODAL ĐĂNG NHẬP GOOGLE AUTH */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />

      </div>
    </AuthProvider>
  );
}
