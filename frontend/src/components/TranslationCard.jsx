import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Languages, 
  Copy, 
  Check, 
  Sparkles, 
  Volume2, 
  AlertCircle 
} from 'lucide-react';

const LANGUAGES = [
  { id: 'English', label: 'English', script: 'Latin' },
  { id: 'Telugu', label: 'Telugu', script: 'తెలుగు' },
  { id: 'Hindi', label: 'Hindi', script: 'हिन्दी' }
];

const TranslationCard = ({ 
  sourceText, 
  detectedLanguage, 
  translation, 
  onTranslate, 
  onTriggerTTS, 
  isTranslating 
}) => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Telugu');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Sync detected language as source language when new transcription arrives
  useEffect(() => {
    if (detectedLanguage) {
      const match = LANGUAGES.find(
        (l) => l.id.toLowerCase() === detectedLanguage.toLowerCase()
      );
      if (match) {
        setSourceLang(match.id);
        // Automatically set a different target language
        if (match.id === 'Telugu') setTargetLang('English');
        else if (match.id === 'Hindi') setTargetLang('English');
        else setTargetLang('Telugu');
      }
    }
  }, [detectedLanguage]);

  const handleSwap = () => {
    if (sourceLang === targetLang) return;
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleTranslateClick = () => {
    setError(null);
    if (!sourceText || !sourceText.trim()) {
      setError('No transcription available to translate. Please record or input speech first.');
      return;
    }
    if (sourceLang === targetLang) {
      setError('Source and target languages cannot be the same. Please choose distinct languages.');
      return;
    }
    onTranslate(sourceText, sourceLang, targetLang);
  };

  const handleCopy = () => {
    if (!translation) return;
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-card-dark">
      
      {/* Top Header & Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Indic Neural Translation</h3>
            <p className="text-[11px] text-slate-400">IndicTrans2 / AI4Bharat Architecture</p>
          </div>
        </div>

        {/* Language Selectors */}
        <div className="flex items-center gap-2 bg-[#090D16] p-1.5 rounded-xl border border-slate-800">
          <select
            value={sourceLang}
            onChange={(e) => {
              setSourceLang(e.target.value);
              if (e.target.value === targetLang) {
                // Pick another target language automatically
                const other = LANGUAGES.find(l => l.id !== e.target.value);
                if (other) setTargetLang(other.id);
              }
            }}
            className="bg-slate-900 text-xs text-slate-200 py-1.5 px-3 rounded-lg border border-slate-700/80 outline-none focus:border-indigo-500 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label} ({l.script})
              </option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            title="Swap Languages"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => {
              setTargetLang(e.target.value);
              if (e.target.value === sourceLang) {
                const other = LANGUAGES.find(l => l.id !== e.target.value);
                if (other) setSourceLang(other.id);
              }
            }}
            className="bg-slate-900 text-xs text-slate-200 py-1.5 px-3 rounded-lg border border-slate-700/80 outline-none focus:border-indigo-500 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id} disabled={l.id === sourceLang}>
                {l.label} ({l.script})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Translated Result Container */}
      <div className="relative min-h-[140px] bg-[#070A12] rounded-xl p-4 border border-slate-800/80">
        {translation ? (
          <p className="text-sm text-cyan-100 font-sans leading-relaxed whitespace-pre-wrap selection:bg-cyan-500">
            {translation}
          </p>
        ) : (
          <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
            <Languages className="w-7 h-7 text-slate-700" />
            <p className="text-xs">
              Select languages and click <b>Translate</b> to process with Indic neural models.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleTranslateClick}
          disabled={isTranslating || !sourceText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-xs shadow-glow-brand transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isTranslating ? 'Translating...' : `Translate to ${targetLang}`}
        </button>

        <div className="flex items-center gap-2">
          {translation && onTriggerTTS && (
            <button
              onClick={() => onTriggerTTS(translation, targetLang)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white text-xs transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Synthesis</span>
            </button>
          )}

          {translation && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationCard;
