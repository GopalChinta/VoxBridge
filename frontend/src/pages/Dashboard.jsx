import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mic2, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  History as HistoryIcon,
  Languages
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AudioRecorder from '../components/AudioRecorder';
import AudioUploader from '../components/AudioUploader';
import TranscriptionCard from '../components/TranscriptionCard';
import TranslationCard from '../components/TranslationCard';
import AudioPlayer from '../components/AudioPlayer';
import LoadingState from '../components/LoadingState';
import HistoryItemCard from '../components/HistoryItemCard';

import { speechAPI } from '../api/speech';
import { translationAPI } from '../api/translation';
import { ttsAPI } from '../api/tts';
import { pdfAPI } from '../api/pdf';
import { historyAPI } from '../api/history';

const Dashboard = () => {
  const { user } = useAuth();

  // Mode: 'record' | 'upload'
  const [activeTab, setActiveTab] = useState('record');

  // AI Pipeline States
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStage, setLoadingStage] = useState('default');
  const [globalError, setGlobalError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Active Session Data
  const [recordId, setRecordId] = useState(null);
  const [originalFilename, setOriginalFilename] = useState('');
  const [transcription, setTranscription] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('English');
  const [translation, setTranslation] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Telugu');
  
  // TTS State
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null);
  const [generatedAudioLang, setGeneratedAudioLang] = useState('Telugu');
  
  // PDF State
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Recent History Preview
  const [recentRecords, setRecentRecords] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchRecentHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await historyAPI.getHistory({ limit: 3 });
      setRecentRecords(data.items || []);
    } catch (err) {
      console.error('Failed to load recent history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchRecentHistory();
  }, []);

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // 1. Handle Audio from Recorder or Uploader
  const handleAudioReady = async (fileOrBlob, filename) => {
    setGlobalError(null);
    setIsProcessing(true);
    setLoadingStage('transcribe');

    // Reset previous session outputs
    setRecordId(null);
    setTranscription('');
    setTranslation('');
    setGeneratedAudioUrl(null);
    setPdfUrl(null);
    setOriginalFilename(filename);

    try {
      const res = await speechAPI.transcribeAudio(fileOrBlob, filename);
      setRecordId(res.record_id);
      setTranscription(res.transcription);
      setDetectedLanguage(res.detected_language);
      
      triggerToast(`Speech transcribed! Detected: ${res.detected_language}`);
      fetchRecentHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to process speech. Please verify your audio format.';
      setGlobalError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Handle Translation
  const handleTranslate = async (text, sourceLang, targetLang) => {
    setGlobalError(null);
    setIsProcessing(true);
    setLoadingStage('translate');

    try {
      const res = await translationAPI.translate({
        text,
        source_language: sourceLang,
        target_language: targetLang,
        record_id: recordId
      });
      setTranslation(res.translation);
      setTargetLanguage(targetLang);
      triggerToast(`Translated from ${sourceLang} to ${targetLang}!`);
      fetchRecentHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Neural translation failed. Please check your language pair.';
      setGlobalError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Handle TTS Generation
  const handleTriggerTTS = async (textToSpeak, lang) => {
    if (!textToSpeak) return;
    setGlobalError(null);
    setIsProcessing(true);
    setLoadingStage('tts');

    try {
      const res = await ttsAPI.generateSpeech({
        text: textToSpeak,
        language: lang,
        record_id: recordId
      });
      setGeneratedAudioUrl(res.audio_url);
      setGeneratedAudioLang(lang);
      triggerToast(`Voice synthesized in ${lang}!`);
      fetchRecentHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Voice synthesis failed. Please try again.';
      setGlobalError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Handle PDF Report Download
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      let activePdfUrl = pdfUrl;
      if (!activePdfUrl) {
        const res = await pdfAPI.generatePDF({
          record_id: recordId,
          original_text: transcription,
          detected_language: detectedLanguage,
          source_language: detectedLanguage,
          target_language: targetLanguage,
          translation: translation
        });
        activePdfUrl = res.pdf_url;
        setPdfUrl(activePdfUrl);
      }

      const fullUrl = activePdfUrl.startsWith('http') ? activePdfUrl : `http://127.0.0.1:8000${activePdfUrl}`;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `VoxBridge_Report_${recordId || 'session'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("PDF Report downloaded successfully!");
      fetchRecentHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || 'PDF report generation failed.';
      setGlobalError(msg);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Reset entire dashboard
  const handleNewSession = () => {
    setRecordId(null);
    setOriginalFilename('');
    setTranscription('');
    setDetectedLanguage('English');
    setTranslation('');
    setGeneratedAudioUrl(null);
    setPdfUrl(null);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header / Greeting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-slate-800 bg-[#0B0F1A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-semibold tracking-wider text-indigo-400">
                VoxBridge Studio
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {user?.name || 'Creator'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Record speech, convert audio, translate across English, Telugu & Hindi, and synthesize voice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {transcription && (
              <button
                onClick={handleNewSession}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-xs text-rose-400 hover:text-white ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn shadow-glow-cyan">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* SECTION 1: Audio Input Tabs (Record vs Upload) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('record')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'record'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-brand'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Mic2 className="w-4 h-4" />
              <span>Record Speech</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-brand'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Audio File</span>
            </button>
          </div>

          {/* Active Audio Component */}
          {activeTab === 'record' ? (
            <AudioRecorder onAudioReady={handleAudioReady} isProcessing={isProcessing} />
          ) : (
            <AudioUploader onAudioReady={handleAudioReady} isProcessing={isProcessing} />
          )}
        </div>

        {/* SECTION 2: AI Loading Stage Indicator */}
        {isProcessing && (
          <div className="py-4">
            <LoadingState stage={loadingStage} />
          </div>
        )}

        {/* SECTION 3: Results Workstation */}
        {(transcription || translation || generatedAudioUrl) && (
          <div className="space-y-6 pt-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white">AI Processing Results</h2>
              </div>

              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf || !transcription}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download Verified PDF'}</span>
              </button>
            </div>

            {/* Transcription & Translation Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Transcription */}
              <TranscriptionCard
                transcription={transcription}
                detectedLanguage={detectedLanguage}
                onTextChange={(val) => setTranscription(val)}
                onTriggerTTS={(text, lang) => handleTriggerTTS(text, lang)}
              />

              {/* Card 2: Translation */}
              <TranslationCard
                sourceText={transcription}
                detectedLanguage={detectedLanguage}
                translation={translation}
                onTranslate={handleTranslate}
                onTriggerTTS={(text, lang) => handleTriggerTTS(text, lang)}
                isTranslating={isProcessing && loadingStage === 'translate'}
              />

            </div>

            {/* Generated Audio Player (TTS) */}
            {generatedAudioUrl && (
              <div className="pt-2 animate-fadeIn">
                <AudioPlayer
                  audioUrl={generatedAudioUrl}
                  title={`Synthesized Voice (${generatedAudioLang})`}
                  language={generatedAudioLang}
                  filename={`voxbridge_${generatedAudioLang}_speech.mp3`}
                />
              </div>
            )}

          </div>
        )}

        {/* SECTION 4: Recent History Quick View */}
        <div className="pt-8 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Recent Conversions</h3>
            </div>
            <a
              href="/history"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View Full History →
            </a>
          </div>

          {recentRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentRecords.map((rec) => (
                <HistoryItemCard
                  key={rec.id}
                  record={rec}
                  onDelete={null} // Don't delete from quick preview
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
              No previous recordings yet. Your processed speech sessions will appear here automatically.
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
