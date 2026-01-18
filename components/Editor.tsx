
import React, { useState } from 'react';
import { Entry } from '../types';
import { summarizeContent, suggestTitleAndTags } from '../services/geminiService';
import { marked } from 'marked';

interface EditorProps {
  entry: Entry;
  onUpdate: (updates: Partial<Entry>) => void;
  onDelete: (id: string) => void;
}

const Editor: React.FC<EditorProps> = ({ entry, onUpdate, onDelete }) => {
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');

  const handleAIInspire = async () => {
    if (!entry.content.trim()) return;
    setIsAIProcessing(true);
    try {
      const suggestions = await suggestTitleAndTags(entry.content);
      onUpdate({ 
        title: entry.title || suggestions.title, 
        tags: Array.from(new Set([...entry.tags, ...suggestions.tags]))
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleAISummarize = async () => {
    if (!entry.content.trim()) return;
    setIsAIProcessing(true);
    try {
      const summary = await summarizeContent(entry.content);
      setAiSummary(summary || "Could not generate summary.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const getMarkdownHtml = () => {
    return { __html: marked.parse(entry.content || '_No content yet. Start writing..._') };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            value={entry.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Untitled document..."
            className="text-2xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent w-full"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
            <button
              onClick={() => setViewMode('write')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'write' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Preview
            </button>
          </div>
          <button
            onClick={handleAIInspire}
            disabled={isAIProcessing}
            title="AI Brainstorming"
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <i className={`fas fa-wand-magic-sparkles ${isAIProcessing ? 'animate-pulse' : ''}`}></i>
          </button>
          <button
            onClick={handleAISummarize}
            disabled={isAIProcessing}
            title="AI Summary"
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <i className="fas fa-align-left"></i>
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {aiSummary && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-100 rounded-xl relative">
              <button 
                onClick={() => setAiSummary(null)} 
                className="absolute top-2 right-2 text-teal-400 hover:text-teal-600"
              >
                <i className="fas fa-times"></i>
              </button>
              <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <i className="fas fa-robot"></i> AI Summary
              </h4>
              <p className="text-sm text-teal-800 leading-relaxed italic">{aiSummary}</p>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-2">
            {entry.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium flex items-center gap-1">
                #{tag}
                <button 
                  onClick={() => onUpdate({ tags: entry.tags.filter(t => t !== tag) })}
                  className="hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
            <input 
              className="text-[10px] outline-none border-b border-transparent focus:border-slate-300 text-slate-500 py-1"
              placeholder="+ Add tag"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) {
                    onUpdate({ tags: Array.from(new Set([...entry.tags, val])) });
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>

          {viewMode === 'write' ? (
            <textarea
              value={entry.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Start writing your thoughts in Markdown..."
              className="w-full h-full resize-none text-slate-700 leading-relaxed focus:outline-none text-lg min-h-[500px]"
            />
          ) : (
            <div 
              className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-indigo-600 pb-20"
              dangerouslySetInnerHTML={getMarkdownHtml()}
            />
          )}
        </div>

        {/* Floating AI Helper Panel */}
        <div className="w-1/4 border-l border-slate-50 bg-slate-50/50 p-6 hidden lg:block overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Stats</h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Created</p>
              <p className="text-sm font-medium text-slate-700">{new Date(entry.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Word Count</p>
              <p className="text-sm font-medium text-slate-700">{entry.content.split(/\s+/).filter(Boolean).length} words</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200">
               <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                 <p className="text-xs text-indigo-600 font-bold mb-2">Editor Tips</p>
                 <ul className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
                   <li><i className="fas fa-check text-green-400 mr-2"></i> Use <strong># Header</strong> for titles.</li>
                   <li><i className="fas fa-check text-green-400 mr-2"></i> Use <strong>- List</strong> for bullet points.</li>
                   <li><i className="fas fa-check text-green-400 mr-2"></i> Use the magic wand for AI titles.</li>
                   <li><i className="fas fa-check text-green-400 mr-2"></i> Changes save automatically.</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
