
import React from 'react';
import { ActiveTab } from '../types.ts';
import { ChimarraoIcon, CoracaoIcon, RelogioIcon, PlusIcon } from './Icons.tsx';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onNewChat }) => {

  const NavButton = ({ tab, icon, label }: { tab: ActiveTab; icon: React.ReactNode; label: string; }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center p-1 w-full rounded-lg transition-colors duration-200 
                 md:flex-row md:justify-start md:px-4 md:py-3 md:w-auto
                 ${activeTab === tab
                   ? 'text-white md:bg-[#D4A574]/30'
                   : 'text-[#F5F1EB]/80 hover:bg-white/10 hover:text-white'
                 }`}
    >
      {icon}
      <span className="mt-1 text-xs font-medium md:mt-0 md:ml-4 md:font-semibold md:text-base">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 z-20 w-full h-16 bg-[#2E4A3A]/95 backdrop-blur-sm shadow-2xl 
                   md:relative md:flex md:flex-col md:h-full md:w-72 md:p-4 md:bg-[#2E4A3A]/90">
      
      {/* Desktop Header */}
      <div className="hidden md:flex items-center mb-8 border-b border-white/20 pb-4">
        <ChimarraoIcon className="w-10 h-10 text-[#D4A574] mr-4"/>
        <h1 className="text-2xl font-bold text-white font-lora">Dona Prenda</h1>
      </div>

      {/* Desktop New Chat Button */}
      <div className="hidden md:block mb-8">
        <button
          onClick={onNewChat}
          className="flex items-center justify-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="ml-3 font-semibold">Novo Papo</span>
        </button>
      </div>
      
      {/* Mobile Nav is a flex row, Desktop is a flex col */}
      <nav className="flex justify-around items-center h-full w-full
                     md:flex-col md:items-stretch md:space-y-2 md:h-auto md:w-auto md:flex-1">
         <NavButton tab={ActiveTab.Chat} icon={<ChimarraoIcon className="w-6 h-6"/>} label="Chat" />
         <NavButton tab={ActiveTab.Favorites} icon={<CoracaoIcon className="w-6 h-6"/>} label="Favoritos" />
         <NavButton tab={ActiveTab.History} icon={<RelogioIcon className="w-6 h-6"/>} label="Histórico" />
         <button onClick={onNewChat} className="flex flex-col items-center justify-center p-1 text-[#F5F1EB]/80 hover:text-white md:hidden">
            <PlusIcon className="w-6 h-6"/>
            <span className="mt-1 text-xs font-medium">Novo</span>
         </button>
      </nav>
    </div>
  );
};

export default Sidebar;