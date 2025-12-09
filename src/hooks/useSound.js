// Custom hook for playing sound effects & BGM
import { useCallback, useRef, useState, useEffect } from 'react';

const useSound = () => {
    const audioContextRef = useRef(null);
    const bgmNodesRef = useRef([]);
    const [isMuted, setIsMuted] = useState(false);

    // Initialize Audio Context on demand
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, []);

    const playSound = useCallback((type) => {
        if (isMuted) return;
        initAudio();

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'success':
                // Nintendo Coin Sound (Square Wave)
                // High B -> High E very fast
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(988, now); // B5
                oscillator.frequency.setValueAtTime(1319, now + 0.08); // E6

                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0.1, now + 0.3);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.35); // Cut off sharply

                oscillator.start(now);
                oscillator.stop(now + 0.35);
                break;

            case 'click':
                // Nintendo Menu Select (Short Triangle)
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1);

                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'error':
                // Nintendo "Bump" / "Deny" Sound
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(120, now);
                oscillator.frequency.linearRampToValueAtTime(80, now + 0.1);

                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.15);

                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;

            case 'reward':
                // Zelda-ish "Item Get" (Fast Arpeggio)
                oscillator.type = 'square';
                // G - B - D - G (Major Chord)
                // We perform a quick slide/arpeggio effect manually
                oscillator.frequency.setValueAtTime(784, now);       // G5
                oscillator.frequency.setValueAtTime(988, now + 0.1); // B5
                oscillator.frequency.setValueAtTime(1175, now + 0.2);// D6
                oscillator.frequency.setValueAtTime(1568, now + 0.3);// G6

                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.setValueAtTime(0.1, now + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                oscillator.start(now);
                oscillator.stop(now + 0.8);
                break;

            case 'hover':
                // Tiny blip
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(600, now);
                gainNode.gain.setValueAtTime(0.02, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.03);
                oscillator.start(now);
                oscillator.stop(now + 0.03);
                break;
        }
    }, [initAudio, isMuted]);

    // BGM: Happy 8-bit Loop
    const playBGM = useCallback(() => {
        if (isMuted || bgmNodesRef.current.length > 0) return;
        initAudio();

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        // Cute "Pico-8" style melody (C Major Pentatonic mostly)
        // C5, E5, G5, A5, G5, E5 pattern
        const notes = [523.25, 659.25, 783.99, 880.00, 783.99, 659.25];
        const durations = [0.2, 0.2, 0.2, 0.4, 0.2, 0.4]; // Rhythm variety

        // Master volume for BGM
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.08; // Small volume so it's background
        masterGain.connect(ctx.destination);

        let startTime = ctx.currentTime + 0.1; // Schedule slightly ahead
        let noteIndex = 0;

        const scheduleNextNote = () => {
            if (!bgmNodesRef.current) return; // Cleanup check

            // Calculate duration of current note
            const duration = durations[noteIndex % durations.length];
            const frequency = notes[noteIndex % notes.length];

            const osc = ctx.createOscillator();
            const envelope = ctx.createGain();

            osc.type = 'triangle'; // Triangle is "flute-like" and cute for BGM
            osc.frequency.value = frequency;

            osc.connect(envelope);
            envelope.connect(masterGain);

            // Staccato envelope (cute short notes)
            envelope.gain.setValueAtTime(0, startTime);
            envelope.gain.linearRampToValueAtTime(0.8, startTime + 0.05);
            envelope.gain.exponentialRampToValueAtTime(0.01, startTime + (duration * 0.8)); // decay slightly before end

            osc.start(startTime);
            osc.stop(startTime + duration);

            // Advance time and index
            startTime += duration;
            noteIndex++;
        };

        // Simple Interval Scheduler
        const intervalId = setInterval(() => {
            // Schedule notes 1.5 seconds ahead
            while (startTime < ctx.currentTime + 1.5) {
                scheduleNextNote();
            }
        }, 500); // Check every 0.5s

        // Store cleanup function
        bgmNodesRef.current.push({
            stop: () => {
                clearInterval(intervalId);
                masterGain.disconnect();
            }
        });

    }, [initAudio, isMuted]);

    const stopBGM = useCallback(() => {
        bgmNodesRef.current.forEach(node => node.stop && node.stop());
        bgmNodesRef.current = [];
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            if (next) {
                stopBGM();
            } else {
                // Resume BGM if unmuted (optional, user might need to interact to start again if completely stopped, 
                // but since we just cleared interval, we can call playBGM again immediately)
                // Check if we assume 'playing' state. For simplicity, let's just re-trigger playBGM in App.jsx logic 
                // OR simply call playBGM() here if we want auto-resume:
                // playBGM(); -> Needs careful handling to not double play. 
                // Let's rely on user interaction or the App.jsx effect to restart if needed, 
                // or just let them re-click.
            }
            return next;
        });
    }, [stopBGM]);

    // Auto-resume BGM when unmuting if it was 'active' logic is complex without state.
    // For this simple app, hitting mute stops it. Unmuting might require a click or we can try auto-resume:
    useEffect(() => {
        if (!isMuted && bgmNodesRef.current.length === 0) {
            // If unmuted and no BGM playing, try playing (only works if AudioContext already authorized)
            // playBGM(); 
        }
    }, [isMuted, playBGM]);

    // Auto-stop on unmount
    useEffect(() => {
        return () => stopBGM();
    }, [stopBGM]);

    return { playSound, playBGM, stopBGM, toggleMute, isMuted };
};

export default useSound;
