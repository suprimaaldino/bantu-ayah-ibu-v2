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

    // BGM: Canon in D - Pachelbel's famous chord progression
    const playBGM = useCallback(() => {
        if (isMuted || bgmNodesRef.current.length > 0) return;
        initAudio();

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        // Canon in D chord progression: D - A - Bm - F#m - G - D - G - A
        const chords = [
            [146.83, 220.00, 293.66], // D Major (D3, A3, D4)
            [110.00, 164.81, 220.00], // A Major (A2, E3, A3)
            [123.47, 185.00, 246.94], // B minor (B2, F#3, B3)
            [92.50, 138.59, 185.00],  // F# minor (F#2, C#3, F#3)
            [98.00, 146.83, 196.00],  // G Major (G2, D3, G3)
            [146.83, 220.00, 293.66], // D Major (D3, A3, D4)
            [98.00, 146.83, 196.00],  // G Major (G2, D3, G3)
            [110.00, 164.81, 220.00], // A Major (A2, E3, A3)
        ];

        const chordDuration = 2.5; // 2.5 seconds per chord

        // Master volume for BGM (very quiet)
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.04; // Very low volume
        masterGain.connect(ctx.destination);

        let startTime = ctx.currentTime + 0.1;
        let chordIndex = 0;

        const scheduleNextChord = () => {
            if (!bgmNodesRef.current || bgmNodesRef.current.length === 0) return;

            const chord = chords[chordIndex % chords.length];

            chord.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const envelope = ctx.createGain();

                // Use sine wave for soft, warm tones
                osc.type = 'sine';
                osc.frequency.value = freq;

                // Add slight detune for warmth
                osc.detune.value = (i - 1) * 3;

                osc.connect(envelope);
                envelope.connect(masterGain);

                // Slow fade in/out (ambient pad style)
                envelope.gain.setValueAtTime(0, startTime);
                envelope.gain.linearRampToValueAtTime(0.3, startTime + 0.5); // Slow fade in
                envelope.gain.setValueAtTime(0.3, startTime + chordDuration - 0.8);
                envelope.gain.linearRampToValueAtTime(0, startTime + chordDuration); // Fade out

                osc.start(startTime);
                osc.stop(startTime + chordDuration + 0.1);
            });

            startTime += chordDuration;
            chordIndex++;
        };

        // Schedule ahead
        const intervalId = setInterval(() => {
            while (startTime < ctx.currentTime + 6) {
                scheduleNextChord();
            }
        }, 2000);

        // Store cleanup
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
