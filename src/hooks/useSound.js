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
                // Super Mario Coin style
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(987.77, now); // B5
                oscillator.frequency.setValueAtTime(1318.51, now + 0.08); // E6
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case 'click':
                // Pop sound
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(300, now);
                oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'error':
                // Buzz
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.linearRampToValueAtTime(100, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case 'reward':
                // Zelda item catch style
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, now); // C5
                oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
                oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
                oscillator.start(now);
                oscillator.stop(now + 0.8);
                break;

            case 'hover':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, now);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;
        }
    }, [initAudio, isMuted]);

    // Simple looped BGM (Arpeggio)
    const playBGM = useCallback(() => {
        if (isMuted || bgmNodesRef.current.length > 0) return;
        initAudio();

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        // Simple cheerful loop: C - E - G - A - G - E - C (Up & Down)
        const notes = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63];
        const interval = 0.4; // seconds per note

        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.05; // Very low background volume
        masterGain.connect(ctx.destination);

        const playNote = (index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = notes[index % notes.length];

            osc.connect(gain);
            gain.connect(masterGain);

            // Envelope to make it sound soft/marimba-ish
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

            osc.start();
            osc.stop(ctx.currentTime + 0.4);

            // Keep track to stop later
            bgmNodesRef.current.push({ stop: () => { try { osc.stop() } catch (e) { } } });
        };

        let noteIndex = 0;
        const timerId = setInterval(() => {
            playNote(noteIndex++);
        }, 400);

        // Save interval ID to clear it
        bgmNodesRef.current.push({ stop: () => clearInterval(timerId) });

    }, [initAudio, isMuted]);

    const stopBGM = useCallback(() => {
        bgmNodesRef.current.forEach(node => node.stop && node.stop());
        bgmNodesRef.current = [];
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            if (!prev) stopBGM();
            return !prev;
        });
    }, [stopBGM]);

    // Auto-stop on unmount
    useEffect(() => {
        return () => stopBGM();
    }, [stopBGM]);

    return { playSound, playBGM, stopBGM, toggleMute, isMuted };
};

export default useSound;
