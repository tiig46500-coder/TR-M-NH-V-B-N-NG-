import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music, 
  ChevronUp, 
  ChevronDown, 
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Track Definition Interface
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  isAiGenerated?: boolean;
  audioBase64?: string;
  mimeType?: string;
  synthType: "lofi" | "acoustic" | "rain" | "custom";
  url?: string;
}

// ==========================================
// 1. Web Audio API Ambient Synthesizer Engine
// ==========================================
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private activeNodes: AudioNode[] = [];
  private mainGain: GainNode | null = null;
  private volume: number = 0.5;
  private currentTrack: Track | null = null;
  private audioEl: HTMLAudioElement | null = null;

  constructor() {}

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);
    } catch (e) {
      console.error("Failed to initialize Web Audio Context:", e);
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
    if (this.audioEl) {
      this.audioEl.volume = vol;
    }
  }

  public start(track: Track) {
    this.init();
    this.stop();
    this.currentTrack = track;
    this.isPlaying = true;

    if (track.url) {
      try {
        this.audioEl = new Audio(track.url);
        this.audioEl.loop = true;
        this.audioEl.volume = this.volume;
        this.audioEl.play().catch((err) => {
          console.warn("Failed to play track URL, falling back to synthesizer:", err);
          this.playSynthesizedFallback(track);
        });
      } catch (e) {
        console.error("Error instantiating Audio element:", e);
        this.playSynthesizedFallback(track);
      }
    } else {
      this.playSynthesizedFallback(track);
    }
  }

  private playSynthesizedFallback(track: Track) {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (track.isAiGenerated && track.audioBase64) {
      this.playBase64Audio(track.audioBase64, track.mimeType || "audio/wav");
    } else {
      switch (track.synthType) {
        case "rain":
          this.playRain();
          break;
        case "acoustic":
          this.playAcousticChords();
          break;
        case "lofi":
        default:
          this.playLofiChords();
          break;
      }
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Stop HTML5 audio element
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch (e) {}
      this.audioEl = null;
    }
    // Stop all active audio nodes safely
    this.activeNodes.forEach((node) => {
      try {
        (node as any).stop();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  private playRain() {
    if (!this.ctx || !this.mainGain) return;

    // Synthesize warm rain noise using custom AudioBuffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Fill the buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter to make it sound like cozy soft rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.mainGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise);

    // Periodic thunder rumbling (low-frequency sweeps)
    const triggerThunder = () => {
      if (!this.ctx || !this.isPlaying || !this.mainGain) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(30 + Math.random() * 20, this.ctx.currentTime);
      
      // Filter thunder
      const thunderFilter = this.ctx.createBiquadFilter();
      thunderFilter.type = "lowpass";
      thunderFilter.frequency.setValueAtTime(100, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 6);

      osc.connect(thunderFilter);
      thunderFilter.connect(gain);
      gain.connect(this.mainGain);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 6);
    };

    this.intervalId = setInterval(triggerThunder, 8000);
  }

  private playLofiChords() {
    if (!this.ctx || !this.mainGain) return;

    // Warm chord progression: Cmaj7 -> Am7 -> Fmaj7 -> G7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
      [349.23, 440.00, 523.25, 659.25], // Fmaj7 (F4, A4, C5, E5)
      [392.00, 480.00, 587.33, 698.46]  // G7    (G4, B4, D5, F5)
    ];

    let chordIndex = 0;
    const playChord = () => {
      if (!this.ctx || !this.isPlaying || !this.mainGain) return;
      const now = this.ctx.currentTime;
      const chord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      chord.forEach((freq) => {
        if (!this.ctx || !this.mainGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Soft triangle wave with high-end filter
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.6); // Slow attack
        gain.gain.setValueAtTime(0.05, now + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4.8); // Smooth release

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.mainGain);
        
        osc.start(now);
        osc.stop(now + 5.0);
      });
    };

    playChord();
    this.intervalId = setInterval(playChord, 5000);
  }

  private playAcousticChords() {
    if (!this.ctx || !this.mainGain) return;

    // Pluck simulation: Am -> G -> F -> Em
    const chords = [
      [220.00, 261.63, 329.63, 440.00], // Am
      [196.00, 246.94, 293.66, 392.00], // G
      [174.61, 220.00, 261.63, 349.23], // F
      [164.81, 246.94, 329.63, 493.88]  // Em
    ];

    let chordIndex = 0;
    const playArpeggio = () => {
      if (!this.ctx || !this.isPlaying || !this.mainGain) return;
      const now = this.ctx.currentTime;
      const chord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      chord.forEach((freq, index) => {
        if (!this.ctx || !this.mainGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        // Stagger the notes to simulate guitar plucking
        const pluckDelay = index * 0.22;
        osc.frequency.setValueAtTime(freq, now + pluckDelay);

        gain.gain.setValueAtTime(0, now + pluckDelay);
        gain.gain.linearRampToValueAtTime(0.08, now + pluckDelay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + pluckDelay + 2.2);

        osc.connect(gain);
        gain.connect(this.mainGain);
        
        osc.start(now + pluckDelay);
        osc.stop(now + pluckDelay + 2.5);
      });
    };

    playArpeggio();
    this.intervalId = setInterval(playArpeggio, 4000);
  }

  private playBase64Audio(base64: string, mimeType: string) {
    if (!this.ctx || !this.mainGain) return;
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      this.ctx.decodeAudioData(bytes.buffer, (buffer) => {
        if (!this.ctx || !this.mainGain || !this.isPlaying) return;
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true; // Loop the generated track
        source.connect(this.mainGain);
        source.start();
        this.activeNodes.push(source);
      }, (err) => {
        console.error("Error decoding audio data from Gemini Lyria:", err);
      });
    } catch (e) {
      console.error("Error setting up decoded base64 play:", e);
    }
  }
}

// Global Synthesizer Instance
const synth = new AmbientSynth();

// ==========================================
// 2. React HealingAudioPlayer Component
// ==========================================
export default function HealingAudioPlayer() {
  // Collapsed vs Expanded State
  const [isExpanded, setIsExpanded] = useState(false);

  // Default Playlist (Vietnamese + AI integration)
  const [playlist, setPlaylist] = useState<Track[]>([
    {
      id: "track-1",
      title: "Đại lộ mặt trời - Chillies (Lofi Ver)",
      artist: "Chillies",
      duration: 180,
      synthType: "lofi",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "track-2",
      title: "lofi thư giãn",
      artist: "CoreZ Chill Beats",
      duration: 210,
      synthType: "lofi",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "track-3",
      title: "tiếng mưa",
      artist: "Thiên Nhiên Chữa Lành",
      duration: 300,
      synthType: "rain",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    }
  ]);

  // Current Playing State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // in seconds



  // Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const activeTrack = playlist[currentTrackIndex];
  const progressInterval = useRef<any>(null);

  // Toast Notification Trigger
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      synth.stop();
      setIsPlaying(false);
    } else {
      synth.start(activeTrack);
      setIsPlaying(true);
      triggerToast(`Đang phát: ${activeTrack.title} 🎧`);
    }
  };

  // Handle Next Track
  const playNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    
    const nextTrack = playlist[nextIndex];
    if (isPlaying) {
      synth.start(nextTrack);
      triggerToast(`Đang phát: ${nextTrack.title} 🎧`);
    } else {
      triggerToast(`Đã chuyển sang: ${nextTrack.title}`);
    }
  };

  // Handle Select Track from Playlist
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    const selected = playlist[index];
    synth.start(selected);
    setIsPlaying(true);
    triggerToast(`Đang phát: ${selected.title} 🎧`);
  };

  // Update volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    synth.setVolume(val);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      synth.setVolume(volume || 0.5);
    } else {
      setIsMuted(true);
      synth.setVolume(0);
    }
  };

  // Increment track progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= activeTrack.duration) {
            // Track finished, skip next
            playNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrackIndex]);

  // Sync initial volume
  useEffect(() => {
    synth.setVolume(volume);
  }, []);

  // Format time (e.g. 125s -> "02:05")
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };



  return (
    <>
      {/* 1. TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/90 text-white font-medium text-xs sm:text-sm border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-500/10 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. AUDIO PLAYER BAR */}
      <div 
        id="healing-audio-player-wrapper"
        className={`fixed bottom-8 left-8 z-[100] font-sans antialiased transition-all duration-300 ${
          isExpanded ? "max-w-[90vw] md:max-w-md w-full" : "w-auto"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            
            // COLLAPSED COMPACT FLOATING CIRCLE BUTTON
            <motion.button
              key="collapsed-player"
              layoutId="player-container"
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 bg-slate-900/90 hover:bg-slate-800/95 text-white rounded-full flex items-center justify-center shadow-2xl border border-white/10 transition-all cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:scale-105 active:scale-95"
              title="Mở trình phát nhạc chữa lành 🌌"
            >
              {/* Vinyl center rotating representation if playing */}
              <div className={`p-3 rounded-full bg-slate-950 border border-white/10 text-emerald-400 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <Music className="w-5 h-5" />
              </div>
              
              {/* Live pulsing dot indicator */}
              {isPlaying && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}

              {/* Hover label tool-tip */}
              <span className="absolute left-16 bg-slate-900/90 text-[10px] text-slate-100 font-medium px-2.5 py-1 rounded-md border border-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                Nhạc chữa lành 🎧
              </span>
            </motion.button>

          ) : (

            // EXPANDED VIEW
            <motion.div
              key="expanded-player"
              layoutId="player-container"
              className="bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-2xl shadow-black/80 text-white flex flex-col space-y-4 relative overflow-hidden"
            >
              {/* Animated soft glow in background */}
              <div className="absolute top-[-20%] left-[-20%] w-[150px] h-[150px] rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />

              {/* Title Header with Collapse trigger */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                    Trình Phát Nhạc Chữa Lành
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Thu gọn"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Song Information & Big Vinyl Artwork */}
              <div className="flex items-center gap-4">
                {/* Rotating Vinyl Circle representation */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center shadow-inner overflow-hidden relative shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    {/* Vinyl center decor */}
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                    </div>
                    {/* Retro lines */}
                    <div className="absolute inset-2 border border-white/5 rounded-full" />
                    <div className="absolute inset-4 border border-white/5 rounded-full" />
                  </div>
                  {isPlaying && (
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center bg-emerald-500 rounded-full shadow-lg">
                      <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-100 truncate">
                    {activeTrack.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {activeTrack.artist}
                  </p>
                  
                  {/* Dynamic mini visualizer wave */}
                  {isPlaying ? (
                    <div className="flex items-end gap-1 h-3 mt-1.5">
                      <span className="w-0.5 bg-emerald-400 h-2.5 animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <span className="w-0.5 bg-emerald-400 h-3.5 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <span className="w-0.5 bg-emerald-400 h-1 animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <span className="w-0.5 bg-emerald-400 h-3 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-emerald-400 h-2 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <span className="w-0.5 bg-emerald-400 h-4 animate-pulse" style={{ animationDelay: '0.15s' }} />
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1 italic">Nhấp phát để nghe hòa âm dễ chịu</p>
                  )}
                </div>
              </div>

              {/* Timeline Progress Bar */}
              <div className="space-y-1">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" 
                    style={{ width: `${(progress / activeTrack.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(activeTrack.duration)}</span>
                </div>
              </div>

              {/* Controls Section (Play, Skip, Volume) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play Button */}
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current text-slate-950" />
                    ) : (
                      <Play className="w-5 h-5 fill-current text-slate-950 ml-0.5" />
                    )}
                  </button>

                  {/* Skip Button */}
                  <button
                    onClick={playNext}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Bài tiếp theo"
                  >
                    <SkipForward className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-2 max-w-[120px] w-full bg-white/5 py-1.5 px-3 rounded-xl border border-white/5">
                  <button
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-emerald-500 h-1 cursor-pointer bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* Playlist Section */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Danh sách nhạc</p>
                <div className="max-h-[105px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {playlist.map((track, idx) => {
                    const isCurrent = idx === currentTrackIndex;
                    return (
                      <button
                        key={track.id}
                        onClick={() => selectTrack(idx)}
                        className={`w-full text-left py-1.5 px-3 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isCurrent 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium" 
                            : "hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          {track.isAiGenerated ? <Sparkles className="w-3 h-3 shrink-0" /> : <Music className="w-3 h-3 shrink-0" />}
                          {track.title}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono font-light shrink-0">
                          {formatTime(track.duration)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>



            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
