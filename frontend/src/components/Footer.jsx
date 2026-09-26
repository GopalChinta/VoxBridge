import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Heart, Sparkles, Shield, Cpu, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080F] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full bg-[#0A0D18] rounded-[6px] flex items-center justify-center">
                <Mic2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">VoxBridge</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered multilingual speech, translation, and voice platform. Speak, translate, and connect seamlessly across English, Telugu, and Hindi.
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Speak. Translate. Connect.</span>
          </div>
        </div>

        {/* AI Capabilities */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            AI Architecture
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-slate-200 transition-colors">OpenAI Whisper Speech-to-Text</li>
            <li className="hover:text-slate-200 transition-colors">IndicTrans2 Neural Core</li>
            <li className="hover:text-slate-200 transition-colors">Acoustic Language Identification</li>
            <li className="hover:text-slate-200 transition-colors">Multi-Tone Voice Synthesizer</li>
            <li className="hover:text-slate-200 transition-colors">ReportLab Verified PDF Generator</li>
          </ul>
        </div>

        {/* Supported Languages */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Supported Languages
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center justify-between">
              <span>English</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">en-US</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Telugu (తెలుగు)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">te-IN</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Hindi (हिन्दी)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">hi-IN</span>
            </li>
          </ul>
        </div>

        {/* Security & Access */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Security & Privacy
          </h4>
          <ul className="space-y-2 text-xs">
            <li>End-to-End JWT Session Auth</li>
            <li>Strict Isolated User Records</li>
            <li>Bcrypt Cryptographic Hashing</li>
            <li>Sanitized Media File Pipelines</li>
            <li>Zero Plain-Text Retention</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 VoxBridge. All rights reserved. “Speak. Translate. Connect.”</p>
        <p className="flex items-center gap-1">
          Designed with precision for modern multilingual AI workflows
        </p>
      </div>
    </footer>
  );
};

export default Footer;
