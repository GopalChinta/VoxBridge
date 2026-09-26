import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Edit3, 
  Languages, 
  Sparkles,
  Volume2
} from 'lucide-react';

const TranscriptionCard = ({ 
  transcription, 
  detectedLanguage, 
  onTextChange, 
  onTriggerTTS 
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageBadge = (lang) => {
    const l = (lang || 'English').toLowerCase();
    if (l.includes('telugu') || l === 'te') {
      return { name: 'Telugu', script: 'తెలుగు', color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30' };
    }
    if (l.includes('hindi') || l === 'hi') {
      return { name: 'Hindi', script: 'हिन्दी', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30' };
    }
    return { name: 'English', script: 'Latin', color: 'from-indigo-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30' };
  };

  const badge = getLanguageBadge(detectedLanguage);
  const wordCount = transcription ? transcription.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = transcription ? transcription.length : 0;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-card-dark">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Transcribed Speech</h3>
            <p className="text-[11px] text-slate-400">OpenAI Whisper STT Engine</p>
          </div>
        </div>

        {/* Detected Language Pill */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-gradient-to-r ${badge.color}`}>
            <Languages className="w-3.5 h-3.5" />
            <span>Detected: <b>{badge.name}</b></span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-serif">
              {badge.script}
            </span>
          </div>
        </div>
      </div>

      {/* Main Text Content */}
      <div className="relative min-h-[140px] bg-[#070A12] rounded-xl p-4 border border-slate-800/80">
        {isEditing ? (
          <textarea
            value={transcription}
            onChange={(e) => onTextChange && onTextChange(e.target.value)}
            className="w-full h-full min-h-[120px] bg-transparent text-sm text-slate-100 outline-none resize-none leading-relaxed font-sans"
            placeholder="Edit transcription..."
          />
        ) : (
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500">
            {transcription || "No speech detected yet. Record or upload an audio file to begin."}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
        <div className="flex items-center gap-3 text-[11px]">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>

        <div className="flex items-center gap-2">
          {onTextChange && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                isEditing
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Done Editing' : 'Edit Text'}
            </button>
          )}

          {onTriggerTTS && (
            <button
              onClick={() => onTriggerTTS(transcription, badge.name)}
              title="Synthesize Voice for Transcription"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              Listen
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionCard;
