import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event for later use
            setDeferredPrompt(e);
            // Show custom install prompt
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Store dismissal in localStorage to not show again for a while
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    // Don't show if dismissed recently (within 7 days)
    useEffect(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - dismissedTime < sevenDays) {
                setShowPrompt(false);
            }
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-in-right">
            <div className="glass-white rounded-3xl p-4 shadow-2xl border-2 border-purple-200 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="text-4xl flex-shrink-0 animate-bounce-slow">📱</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-game font-bold text-gray-800 text-base mb-1">
                            Install Aplikasi
                        </h3>
                        <p className="text-xs text-gray-600 font-fun mb-3">
                            Install Bantu Ayah Ibu di perangkatmu untuk akses lebih cepat dan bisa digunakan offline!
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="btn-game bg-gradient-purple-pink text-white px-4 py-2 rounded-full font-game font-bold text-xs shadow-glow-purple hover:scale-105 active:scale-95 transition-all duration-300 flex-1"
                            >
                                ✨ Install Sekarang
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-3 py-2 rounded-full font-game font-bold text-xs text-gray-500 hover:bg-gray-100 transition-all duration-300"
                            >
                                Nanti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
