import React, { useState } from 'react';
import { 
  FileText, 
  Languages, 
  Calendar, 
  Trash2, 
  Download, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Sparkles,
  FileCheck2,
  FileAudio
} from 'lucide-react';
import { pdfAPI } from '../api/pdf';

const HistoryItemCard = ({ record, onDelete, onPlayAudio }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      let pdfUrl = record.pdf_url;
      if (!pdfUrl) {
        const res = await pdfAPI.generatePDF({
          record_id: record.id,
          original_text: record.transcription,
          detected_language: record.detected_language,
          source_language: record.source_language || record.detected_language,
          target_language: record.target_language,
          translation: record.translation
        });
        pdfUrl = res.pdf_url;
      }

      const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `http://127.0.0.1:8000${pdfUrl}`;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `VoxBridge_Report_${record.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const toggleInlineAudio = () => {
    const audioUrl = record.generated_audio_url || record.audio_url;
    if (!audioUrl) return;

    const fullUrl = audioUrl.startsWith('http') ? audioUrl : `http://127.0.0.1:8000${audioUrl}`;

    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
    } else {
      if (audioObj) {
        audioObj.play();
        setIsPlayingAudio(true);
      } else {
        const newAudio = new Audio(fullUrl);
        newAudio.onended = () => setIsPlayingAudio(false);
        newAudio.play();
        setAudioObj(newAudio);
        setIsPlayingAudio(true);
      }
    }
  };

  const activeAudioUrl = record.generated_audio_url || record.audio_url;

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 bg-[#0C111D] space-y-4">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatDate(record.created_at)}</span>
          <span>•</span>
          <span className="truncate max-w-[140px] text-slate-300 font-mono text-[11px]">
            {record.original_filename || 'Audio Recording'}
          </span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {record.detected_language && (
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
              {record.detected_language}
            </span>
          )}
          {record.target_language && (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-medium">
              → {record.target_language}
            </span>
          )}
        </div>
      </div>

      {/* Transcription & Translation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Original */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Original ({record.detected_language || 'Speech'})
          </span>
          <p className="text-slate-200 line-clamp-3 leading-relaxed">
            {record.transcription || 'No transcription available.'}
          </p>
        </div>

        {/* Translation */}
        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1.5">
          <span className="text-[10px] uppercase font-semibold text-indigo-300 tracking-wider">
            Translation ({record.target_language || 'Target'})
          </span>
          <p className="text-cyan-200 line-clamp-3 leading-relaxed">
            {record.translation || 'No translation performed.'}
          </p>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          {activeAudioUrl && (
            <button
              onClick={toggleInlineAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs transition-colors"
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Pause' : 'Play Audio'}</span>
            </button>
          )}

          <button
            onClick={() => handleCopy(record.translation || record.transcription)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'PDF...' : 'Download PDF'}</span>
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(record.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryItemCard;
