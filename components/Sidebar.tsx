
import React from 'react';
import { Entry, ContentType } from '../types';

interface SidebarProps {
  entries: Entry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: (type: ContentType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBackHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  entries, 
  activeId, 
  onSelect, 
  onNew, 
  searchQuery, 
  setSearchQuery,
  onBackHome
}) => {
  const filteredEntries = entries.filter(e => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-80 h-full border-r border-slate-200 bg-white flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <i className="fas fa-leaf text-green-500"></i> ZenSpace
          </h1>
          <button 
            onClick={onBackHome}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
            title="Back to Home"
          >
            <i className="fas fa-home"></i>
          </button>
        </div>
        
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search notes, blogs, tags..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onNew('blog')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-pen-nib"></i> Blog
          </button>
          <button 
            onClick={() => onNew('note')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-sticky-note"></i> Note
          </button>
        </div>
      </div>

      <div className="px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        <span>{searchQuery ? 'Search Results' : 'Recent Items'}</span>
        {searchQuery && <span className="text-indigo-500 bg-indigo-50 px-1.5 rounded">{filteredEntries.length} found</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            <i className="fas fa-inbox text-3xl mb-2 opacity-50"></i>
            <p>No matches found</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry.id)}
              className={`w-full text-left p-3 rounded-xl transition-all group ${
                activeId === entry.id 
                  ? 'bg-indigo-50 border-indigo-100 shadow-sm ring-1 ring-indigo-200' 
                  : 'hover:bg-slate-50 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  entry.type === 'blog' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {entry.type}
                </span>
                <span className="text-slate-400 text-[10px]">
                  {new Date(entry.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className={`font-semibold text-sm truncate ${activeId === entry.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                {entry.title || 'Untitled'}
              </h3>
              <p className="text-slate-500 text-xs line-clamp-1 mt-1 font-light italic">
                {entry.content.substring(0, 60)}...
              </p>
              {entry.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {entry.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-[8px] text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">
                      #{tag}
                    </span>
                  ))}
                  {entry.tags.length > 2 && <span className="text-[8px] text-slate-400">+{entry.tags.length - 2}</span>}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
