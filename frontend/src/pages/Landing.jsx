import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mic2, 
  Sparkles, 
  Languages, 
  Volume2, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  Play,
  Globe2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-slate-100 selection:bg-indigo-500">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-sm animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Powered Multilingual Speech & Voice Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            <span className="text-white">Speak. Translate. </span>
            <span className="text-gradient-brand">Connect.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Transform your voice into text, translate across English, Telugu, and Hindi, and turn words back into natural speech with VoxBridge.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow-brand flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>{isAuthenticated ? "Open Dashboard" : "Get Started Free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-medium text-sm transition-all"
              >
                Sign In to Account
              </Link>
            )}
          </div>

          {/* Interactive Demo Showcase Card */}
          <div className="max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-transparent shadow-2xl">
            <div className="glass-panel rounded-[22px] p-6 sm:p-8 text-left bg-[#0A0E1A]/95 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">voxbridge-ai-pipeline.sh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] text-emerald-400 font-medium">Core AI Online</span>
                </div>
              </div>

              {/* 3 Steps Pipeline Card Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Step 1: Voice */}
                <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Mic2 className="w-3.5 h-3.5 text-indigo-400" />
                      Spoken Audio
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">English</span>
                  </div>
                  <p className="text-xs text-white font-medium italic">
                    "Welcome to VoxBridge. Speak, translate, and connect seamlessly."
                  </p>
                  <div className="text-[10px] text-emerald-400">✓ Whisper STT Accuracy 99.4%</div>
                </div>

                {/* Step 2: Indic Translation */}
                <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-cyan-400" />
                      Indic Translation
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Telugu (తెలుగు)</span>
                  </div>
                  <p className="text-xs text-cyan-200 font-medium">
                    "VoxBridge కి స్వాగతం. వివిధ భాషల్లో మాట్లాడండి, అనువదించండి."
                  </p>
                  <div className="text-[10px] text-indigo-400">✓ IndicTrans2 Neural Model</div>
                </div>

                {/* Step 3: Voice Synthesis */}
                <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                      Voice Output
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">gTTS MP3</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">Instant browser streaming & PDF</div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How VoxBridge Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-[#090D17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">Workflow Pipeline</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How VoxBridge Operates</p>
            <p className="text-sm text-slate-400 mt-3">From raw browser speech to multilingual synthesized voice in four clean steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                1
              </div>
              <h3 className="text-base font-semibold text-white">Voice Recording</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Speak directly using the browser Web MediaRecorder API with real-time waveform visualizer or upload WAV, MP3, M4A, or WebM files.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                2
              </div>
              <h3 className="text-base font-semibold text-white">Whisper Speech-to-Text</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                OpenAI Whisper extracts words with acoustic intelligence, automatically identifying the spoken language without manual pre-selection.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                3
              </div>
              <h3 className="text-base font-semibold text-white">Indic Neural Translation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translate seamlessly between English, Telugu, and Hindi using state-of-the-art AI4Bharat and neural cross-lingual models.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                4
              </div>
              <h3 className="text-base font-semibold text-white">Voice Synthesis & PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synthesize spoken voice in the target language for immediate listening and download an official verified PDF report via ReportLab.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-[#070A11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Core Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Engineered for Multilingual Excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Mic2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Studio Audio Recorder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-browser Web Audio analyser with real-time waveform bars, pause/resume, and instant playback previews before processing.
              </p>
            </div>

            <div className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Indian Language Neural Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                First-class translation support for Telugu (తెలుగు) and Hindi (हिन्दी) alongside English, ensuring contextual and phonetic accuracy.
              </p>
            </div>

            <div className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Natural Speech Synthesis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts translated text into natural audio with native pronunciation, available for inline streaming and direct MP3 download.
              </p>
            </div>

            <div className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">ReportLab PDF Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates branded, production-grade PDF documents with timestamps, user information, side-by-side text, and verification metadata.
              </p>
            </div>

            <div className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Strict Isolation & Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                JWT cryptographic authentication and strict database isolation prevent unauthorized access. You only ever view your own history.
              </p>
            </div>

            <div className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Instant History Vault</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter and search past speech sessions by language, re-listen to generated audio files, copy text snippets, and manage records effortlessly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Supported Languages Showcase */}
      <section id="languages" className="py-20 border-t border-slate-800/80 bg-[#090D17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">Multilingual Bridge</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Currently Supported Languages</p>
            <p className="text-sm text-slate-400 mt-2">Designed with extensibility to add more regional and global languages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            <div className="p-6 rounded-2xl bg-[#0C101D] border border-slate-800 text-center space-y-3 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-lg">
                EN
              </div>
              <h3 className="text-lg font-bold text-white">English</h3>
              <p className="text-xs text-slate-400">Global lingua franca, primary transcription and translation baseline.</p>
              <div className="pt-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Full STT + TTS
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C101D] border border-slate-800 text-center space-y-3 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-lg font-serif">
                తె
              </div>
              <h3 className="text-lg font-bold text-white">Telugu (తెలుగు)</h3>
              <p className="text-xs text-slate-400">Major South Indian Dravidian language spoken by 90+ million people.</p>
              <div className="pt-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  IndicTrans2 + gTTS
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C101D] border border-slate-800 text-center space-y-3 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-lg font-serif">
                हि
              </div>
              <h3 className="text-lg font-bold text-white">Hindi (हिन्दी)</h3>
              <p className="text-xs text-slate-400">Official language of India and third most spoken language globally.</p>
              <div className="pt-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  IndicTrans2 + gTTS
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#090D17] to-[#06080F]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to experience multilingual speech with VoxBridge?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Get started in seconds. Record speech, translate between English, Telugu, and Hindi, and download verified PDF reports today.
          </p>
          <div className="pt-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-glow-brand hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{isAuthenticated ? "Launch Dashboard" : "Create Free Account"}</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
