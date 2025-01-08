import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <div 
      className="group relative w-8 hover:w-64 transition-all duration-300 bg-slate-300 h-screen"
    >
      <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black">
        <div className="absolute right-0 top-[200px] transform translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 border-2 border-black flex items-center justify-center">
          <span className="transform rotate-0">❯</span>
        </div>
      </div>
      <div className="p-4 invisible group-hover:visible whitespace-nowrap">
        <h1 className="text-black text-2xl font-bold">PaperClip</h1>
      </div>
    </div>
  );
};
