import { useState, useEffect } from 'react';
import { useOffline } from '../../hooks/useOffline';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const OfflineBanner: React.FC = () => {
    const { isOffline } = useOffline();
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [updateAvailable, setUpdateAvailable] = useState(false);

    // PWA Install-Prompt abfangen
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Service Worker Update erkennen
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) {
                    reg.addEventListener('updatefound', () => {
                        const newSW = reg.installing;
                        newSW?.addEventListener('statechange', () => {
                            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                                setUpdateAvailable(true);
                            }
                        });
                    });
                }
            });
        }
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    const handleUpdate = () => {
        window.location.reload();
    };

    return (
        <>
            {isOffline && (
                <div className="offline-banner">
                    📡 Du bist offline — Daten werden lokal gespeichert.
                </div>
            )}

            {installPrompt && (
                <div className="offline-banner" style={{ background: 'var(--primary)', cursor: 'pointer' }} onClick={handleInstall}>
                    📲 VacaTrack als App installieren — Tippe hier!
                </div>
            )}

            {updateAvailable && (
                <div className="offline-banner" style={{ background: 'var(--info)', cursor: 'pointer' }} onClick={handleUpdate}>
                    🔄 Neues Update verfügbar — Tippe zum Aktualisieren!
                </div>
            )}
        </>
    );
};

export default OfflineBanner;