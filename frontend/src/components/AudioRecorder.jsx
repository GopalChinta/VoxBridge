import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Pause, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  AlertCircle 
} from 'lucide-react';

const AudioRecorder = ({ onAudioReady, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Draw real-time audio visualizer
  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient from indigo to cyan
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#06B6D4');
        gradient.addColorStop(0.5, '#6366F1');
        gradient.addColorStop(1, '#8B5CF6');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }
    };

    render();
  };

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Setup MediaRecorder
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(recordedBlob);
        setAudioBlob(recordedBlob);
        setAudioUrl(url);

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start(250); // Collect data every 250ms
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Start visualizer animation
      drawVisualizer();

    } catch (err) {
      console.error('Microphone access failed:', err);
      setError('Unable to access microphone. Please grant browser microphone permissions to record.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
  };

  const handleProcess = () => {
    if (audioBlob && onAudioReady) {
      onAudioReady(audioBlob, `speech_recording_${Date.now()}.webm`);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-900/60 rounded-2xl border border-slate-800">
      
      {/* Error Alert */}
      {error && (
        <div className="w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Visualizer Canvas & Indicator */}
      <div className="relative w-full max-w-md h-28 bg-[#070A12] rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden mb-6 shadow-inner">
        {isRecording ? (
          <canvas
            ref={canvasRef}
            width={400}
            height={110}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-slate-500 flex flex-col items-center gap-2">
            <Volume2 className="w-7 h-7 text-slate-600" />
            <span className="text-xs">Microphone ready. Press Start to speak.</span>
          </div>
        )}

        {/* Live Recording Pulsing Tag */}
        {isRecording && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[11px] font-semibold text-rose-400">
            <span className={`w-2 h-2 rounded-full bg-rose-500 ${isPaused ? '' : 'animate-ping'}`} />
            {isPaused ? 'PAUSED' : 'RECORDING'}
          </div>
        )}

        {/* Timer Badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/60 font-mono text-xs text-slate-200">
          {formatTime(duration)}
        </div>
      </div>

      {/* Recording Control Buttons */}
      <div className="flex items-center gap-3 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-sm shadow-glow-brand transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeRecording}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
              >
                <Pause className="w-4 h-4 text-amber-400" />
                Pause
              </button>
            )}

            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium shadow-md shadow-rose-900/30 transition-all"
            >
              <Square className="w-4 h-4 fill-white" />
              Stop Recording
            </button>
          </>
        )}

        {audioUrl && !isRecording && (
          <button
            onClick={resetRecording}
            title="Record Again"
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Audio Preview & Process Trigger */}
      {audioUrl && !isRecording && (
        <div className="w-full max-w-md p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Audio Preview ({formatTime(duration)})</span>
            <span className="text-emerald-400 font-medium">Ready to transcribe</span>
          </div>

          <audio src={audioUrl} controls className="w-full h-10 rounded-lg outline-none" />

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-glow-brand transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            {isProcessing ? 'Processing Speech...' : 'Process Audio with AI'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
