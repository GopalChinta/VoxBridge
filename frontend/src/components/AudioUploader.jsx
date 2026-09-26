import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileAudio, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const ALLOWED_EXTENSIONS = ['.wav', '.mp3', '.m4a', '.webm', '.ogg'];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const AudioUploader = ({ onAudioReady, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSelectFile = (file) => {
    setError(null);
    if (!file) return;

    // Check extension
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !file.type.startsWith('audio/')) {
      setError(`Invalid file format '${ext}'. Allowed audio formats: WAV, MP3, M4A, WebM, OGG.`);
      return;
    }

    // Check size limit (25MB)
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB. Please select a smaller recording.`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setSelectedFile(null);
    setAudioUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProcess = () => {
    if (selectedFile && onAudioReady) {
      onAudioReady(selectedFile, selectedFile.name);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-900/60 rounded-2xl border border-slate-800">
      
      {/* Error Notification */}
      {error && (
        <div className="w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-lg p-8 sm:p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-indigo-400 bg-indigo-500/10 shadow-glow-brand scale-[1.01]' 
              : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => validateAndSelectFile(e.target.files?.[0])}
            accept=".wav,.mp3,.m4a,.webm,.ogg,audio/*"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7 text-indigo-400" />
          </div>

          <h4 className="text-sm font-semibold text-slate-200 mb-1 text-center">
            Click to upload or drag & drop audio
          </h4>
          <p className="text-xs text-slate-400 text-center mb-3">
            Supports MP3, WAV, M4A, WebM (Max {MAX_SIZE_MB}MB)
          </p>

          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
            Browse Audio Files
          </span>
        </div>
      ) : (
        <div className="w-full max-w-md p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          {/* File Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 truncate pr-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <FileAudio className="w-5 h-5" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate max-w-[220px]">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="uppercase text-emerald-400 font-medium">Valid Audio</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemove}
              title="Remove File"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Player Preview */}
          {audioUrl && (
            <audio src={audioUrl} controls className="w-full h-10 rounded-lg outline-none" />
          )}

          {/* Action Button */}
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-glow-brand transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            {isProcessing ? 'Processing Speech...' : 'Process Audio with AI'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
