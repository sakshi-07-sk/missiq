import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  FileText, 
  Code, 
  Calendar, 
  Printer, 
  Copy, 
  Check 
} from 'lucide-react';
import { CatchUpAnalysis } from '../types';
import { generateMarkdownReport, generateIcsCalendar, downloadTextFile } from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CatchUpAnalysis;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportMarkdown = () => {
    const md = generateMarkdownReport(analysis);
    downloadTextFile('catchup-intelligence-briefing.md', md, 'text/markdown');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(analysis, null, 2);
    downloadTextFile('catchup-intelligence-data.json', jsonStr, 'application/json');
  };

  const handleExportIcs = () => {
    const ics = generateIcsCalendar(analysis);
    downloadTextFile('catchup-deadlines.ics', ics, 'text/calendar');
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport(analysis);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-aurora-surface border border-aurora-border rounded-3xl shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-aurora-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-aurora-primary/15 text-aurora-primary border border-aurora-primary/20">
              <FileDown className="w-5 h-5 text-aurora-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-aurora-text">Export Intelligence Briefing</h3>
              <p className="text-xs text-aurora-muted">Save summary, tasks, decisions & calendars</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-aurora-muted hover:text-aurora-text hover:bg-aurora-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Markdown Download */}
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border hover:border-aurora-primary/60 hover:bg-aurora-elevated text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <FileText className="w-5 h-5 text-aurora-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-aurora-primary bg-aurora-primary/10 px-1.5 py-0.5 rounded border border-aurora-primary/20">.MD</span>
            </div>
            <h4 className="text-xs font-semibold text-aurora-text">Markdown Report</h4>
            <p className="text-[11px] text-aurora-muted mt-0.5">Clean notes format for Notion, Obsidian, GitHub</p>
          </button>

          {/* JSON Export */}
          <button
            type="button"
            onClick={handleExportJson}
            className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border hover:border-aurora-secondary/60 hover:bg-aurora-elevated text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Code className="w-5 h-5 text-aurora-secondary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-aurora-secondary bg-aurora-secondary/10 px-1.5 py-0.5 rounded border border-aurora-secondary/20">.JSON</span>
            </div>
            <h4 className="text-xs font-semibold text-aurora-text">Structured JSON</h4>
            <p className="text-[11px] text-aurora-muted mt-0.5">Raw structured data for downstream APIs</p>
          </button>

          {/* iCalendar Export */}
          <button
            type="button"
            onClick={handleExportIcs}
            className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border hover:border-aurora-warning/60 hover:bg-aurora-elevated text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Calendar className="w-5 h-5 text-aurora-warning group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-aurora-warning bg-aurora-warning/10 px-1.5 py-0.5 rounded border border-aurora-warning/20">.ICS</span>
            </div>
            <h4 className="text-xs font-semibold text-aurora-text">iCalendar (.ics)</h4>
            <p className="text-[11px] text-aurora-muted mt-0.5">Sync tasks into Google, Outlook, or Apple Cal</p>
          </button>

          {/* Print / PDF view */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border hover:border-aurora-primary/60 hover:bg-aurora-elevated text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Printer className="w-5 h-5 text-aurora-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-aurora-primary bg-aurora-primary/10 px-1.5 py-0.5 rounded border border-aurora-primary/20">PDF</span>
            </div>
            <h4 className="text-xs font-semibold text-aurora-text">Printable Briefing</h4>
            <p className="text-[11px] text-aurora-muted mt-0.5">Formatted executive PDF print view</p>
          </button>
        </div>

        {/* Copy to clipboard bar */}
        <div className="mt-4 pt-3 border-t border-aurora-border flex items-center justify-between">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-aurora-elevated hover:bg-aurora-border/40 text-aurora-text transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-aurora-primary" />
                <span className="text-aurora-primary font-semibold">Markdown Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown to Clipboard</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl text-xs font-bold aurora-btn-primary transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
