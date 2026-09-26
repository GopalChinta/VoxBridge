import React from 'react';
import { Loader2, Sparkles, Cpu, Mic, Languages, Music, FileText } from 'lucide-react';

const STAGE_CONFIG = {
  transcribe: {
    icon: Mic,
    title: "Converting Speech to Text...",
    subtitle: "Analyzing acoustic patterns & detecting language via Whisper AI",
    color: "from-indigo-500 to-purple-600"
  },
  translate: {
    icon: Languages,
    title: "Neural Translation in Progress...",
    subtitle: "Mapping semantics across Indian languages via IndicTrans2",
    color: "from-cyan-500 to-indigo-600"
  },
  tts: {
    icon: Music,
    title: "Synthesizing Multilingual Voice...",
    subtitle: "Generating natural, expressive speech with native phonetics",
    color: "from-purple-500 to-pink-600"
  },
  pdf: {
    icon: FileText,
    title: "Generating Verified Session PDF...",
    subtitle: "Compiling layout, transcriptions, and metadata with ReportLab",
    color: "from-emerald-500 to-teal-600"
  },
  default: {
    icon: Cpu,
    title: "Processing AI Request...",
    subtitle: "VoxBridge neural pipeline executing tasks",
    color: "from-indigo-600 to-cyan-500"
  }
};

const LoadingState = ({ stage = "default", customMessage = null }) => {
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.default;
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 rounded-2xl border border-indigo-500/30 shadow-glow-brand animate-pulse-slow">
      {/* Animated Glowing Ring */}
      <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${config.color} opacity-40 blur-md animate-ping`} />
        <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center relative z-10">
          <IconComponent className="w-6 h-6 text-cyan-300 animate-pulse" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h4 className="text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-2">
          <span>{customMessage || config.title}</span>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
        </h4>
        <p className="text-xs text-slate-400 max-w-sm">
          {config.subtitle}
        </p>
      </div>

      {/* Progress Line */}
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-5">
        <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 animate-[wave_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default LoadingState;
