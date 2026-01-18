
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import CursorTrail from './components/CursorTrail';
import { Entry, ContentType } from './types';

const STORAGE_KEY = 'zenspace_data_v1';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'workspace'>('home');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    } else {
      const initial: Entry = {
        id: '1',
        title: 'Welcome to APPLE\'S Blog',
        content: '# Getting Started\n\nThis is your personal space for writing and thinking.\n\n### Features\n- AI-powered summaries\n- Catchy title generation\n- Minimalist Markdown-ready editor\n- Instant search',
        type: 'note',
        tags: ['welcome', 'guide'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setEntries([initial]);
      setActiveId(initial.id);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const handleNewEntry = (type: ContentType) => {
    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      content: '',
      type,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
    setActiveId(newEntry.id);
  };

  const handleUpdateEntry = (updates: Partial<Entry>) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === activeId) {
        return { ...entry, ...updates, updatedAt: Date.now() };
      }
      return entry;
    }));
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      const remaining = entries.filter(e => e.id !== id);
      setEntries(remaining);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const activeEntry = entries.find(e => e.id === activeId);

  return (
    <>
      <CursorTrail />
      {view === 'home' ? (
        <div className="min-h-screen w-full bg-[#fffdfa] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-700">
          {/* Decorative Snowflakes */}
          <div className="fixed inset-0 pointer-events-none z-0">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="snowflake">❅</div>
            ))}
          </div>

          <div className="max-w-4xl w-full text-center space-y-16 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="relative">
              <div className="flex justify-center mb-4">
                <i className="fas fa-holly-berry text-red-600 text-3xl opacity-80"></i>
              </div>
              <h1 className="text-6xl md:text-[110px] font-[900] tracking-tighter uppercase mb-6 leading-none christmas-gradient drop-shadow-sm">
                APPLE'S Blog
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-[2px] w-12 bg-red-200"></div>
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Curated Thoughts & Notes</span>
                <div className="h-[2px] w-12 bg-red-200"></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
               <button 
                  onClick={() => setView('workspace')}
                  className="group relative bg-white border border-slate-100 p-10 rounded-[40px] text-left hover:shadow-2xl hover:shadow-red-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
               >
                  <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                     <i className="fas fa-tree text-[200px] text-green-900"></i>
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <i className="fas fa-feather-pointed text-2xl"></i>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Notes & Thoughts</h3>
                    <p className="text-slate-500 leading-relaxed mb-8 font-medium">
                      Your minimalist winter archive for personal blog posts, captures, and documentation.
                    </p>
                    <span className="inline-flex items-center gap-3 text-red-600 font-black text-sm uppercase tracking-wider">
                      Enter Workspace <i className="fas fa-chevron-right text-xs group-hover:translate-x-2 transition-transform"></i>
                    </span>
                  </div>
               </button>

               <div className="bg-slate-50/40 border-2 border-dashed border-slate-200 p-10 rounded-[40px] flex items-center justify-center relative group overflow-hidden">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-gift text-xl"></i>
                    </div>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">Upcoming Feature</p>
                    <p className="text-xs text-slate-300 mt-2">Personal Gallery</p>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/0 via-white/0 to-white/40 pointer-events-none"></div>
               </div>
            </div>
            
            <footer className="pt-12">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Est. 2024 • Minimalist Archive</p>
            </footer>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 animate-in fade-in duration-700">
          <Sidebar 
            entries={entries} 
            activeId={activeId} 
            onSelect={setActiveId} 
            onNew={handleNewEntry}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onBackHome={() => setView('home')}
          />
          
          <main className="flex-1 flex flex-col relative overflow-hidden">
            {activeEntry ? (
              <Editor 
                entry={activeEntry} 
                onUpdate={handleUpdateEntry} 
                onDelete={handleDeleteEntry}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white">
                <div className="text-center space-y-6 max-w-md p-8">
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-edit text-4xl text-red-400"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Ready to write?</h2>
                  <p className="text-slate-500 leading-relaxed">
                    Choose a document from your library or start a fresh Christmas story.
                  </p>
                  <div className="flex justify-center gap-4 pt-6">
                    <button 
                      onClick={() => handleNewEntry('blog')}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                    >
                      New Blog Post
                    </button>
                    <button 
                      onClick={() => handleNewEntry('note')}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                    >
                      Quick Note
                    </button>
                  </div>
                </div>
              </div>
            )}

            <footer className="bg-white px-6 py-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between items-center">
              <div className="font-bold tracking-widest uppercase">
                APPLE'S BLOG • {entries.length} ITEMS
              </div>
              <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1 font-medium">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> Christmas Cloud Sync Active
                 </span>
              </div>
            </footer>
          </main>
        </div>
      )}
    </>
  );
};

export default App;
