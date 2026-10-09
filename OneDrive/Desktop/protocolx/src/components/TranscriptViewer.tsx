import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  User, 
  Filter, 
  X,
  Clock
} from 'lucide-react';
import { ChatMessage } from '../types';

interface TranscriptViewerProps {
  messages: ChatMessage[];
  highlightedMessageId: string | null;
  onClearHighlight: () => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  messages,
  highlightedMessageId,
  onClearHighlight,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSender, setSelectedSender] = useState<string>('all');
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const senders = Array.from(new Set(messages.map(m => m.sender).filter(Boolean)));

  // Auto-scroll to highlighted message
  useEffect(() => {
    if (highlightedMessageId && messageRefs.current[highlightedMessageId]) {
      messageRefs.current[highlightedMessageId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightedMessageId]);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch = !searchTerm || m.content.toLowerCase().includes(searchTerm.toLowerCase()) || m.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSender = selectedSender === 'all' || m.sender === selectedSender;
    return matchesSearch && matchesSender;
  });

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Full Conversation Stream ({messages.length})
            </h2>
            <p className="text-[11px] text-slate-400">
              Inspect grounded source lines with direct context
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript..."
              className="pl-8 pr-3 py-1 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sender filter */}
          <select
            value={selectedSender}
            onChange={(e) => setSelectedSender(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Senders</option>
            {senders.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Highlight Banner */}
      {highlightedMessageId && (
        <div className="my-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
          <span>Highlighting grounded source for selected item</span>
          <button
            onClick={onClearHighlight}
            className="text-indigo-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Container */}
      <div className="mt-3 max-h-96 overflow-y-auto space-y-2.5 pr-1">
        {filteredMessages.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No messages matched your filter.
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isHighlighted = msg.id === highlightedMessageId;

            return (
              <div
                key={msg.id}
                ref={(el) => { messageRefs.current[msg.id] = el; }}
                className={`p-3 rounded-xl border transition-all text-xs ${
                  isHighlighted
                    ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-indigo-300">
                      {msg.sender.charAt(0).toUpperCase()}
                    </span>
                    <span>{msg.sender}</span>
                  </div>

                  {msg.timestamp && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.timestamp}
                    </span>
                  )}
                </div>

                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed pl-6.5">
                  {msg.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
