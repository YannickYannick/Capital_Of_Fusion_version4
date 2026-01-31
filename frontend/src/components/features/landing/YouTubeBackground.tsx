"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useYouTubeVisibility } from '@/contexts/YouTubeVisibilityContext';
import { usePlanetsOptions } from '@/contexts/PlanetsOptionsContext';
import { Volume2, VolumeX } from 'lucide-react';

interface YouTubeBackgroundProps {
    videoId: string;
    className?: string;
}

export default function YouTubeBackground({ videoId, className = '' }: YouTubeBackgroundProps) {
    const [isMuted, setIsMuted] = useState(true);
    const { isYouTubeVisible, setIsYouTubeVisible } = useYouTubeVisibility();
    const { enableVideoCycle, grayscaleVideo } = usePlanetsOptions();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const pathname = usePathname();
    const isExplorePage = pathname === '/explore';

    const videoUrl = `https://www.youtube.com/embed/${videoId}?si=0hJOpQv2p215JRzm&autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`;

    // Animation de cycle sur la page explore - avec transition sympa
    useEffect(() => {
        if (!isExplorePage || !enableVideoCycle) {
            // Sur les autres pages ou si le cycle est désactivé, la vidéo est toujours visible
            setIsYouTubeVisible(true);
            return;
        }

        // Sur la page explore avec cycle activé, créer un cycle de fade in/out
        let intervalId: NodeJS.Timeout;
        let timeoutId: NodeJS.Timeout;

        const cycleVideo = () => {
            // Apparition - visible pendant 3 secondes
            setIsYouTubeVisible(true);
            
            // Après 3 secondes, disparition avec transition
            timeoutId = setTimeout(() => {
                setIsYouTubeVisible(false);
            }, 3000);
        };

        // Commencer avec la vidéo visible, puis démarrer le cycle
        setIsYouTubeVisible(true);
        
        // Démarrer le premier cycle après 3 secondes
        timeoutId = setTimeout(() => {
            setIsYouTubeVisible(false);
            // Répéter le cycle toutes les 8 secondes (3s visible + 5s cachée)
            intervalId = setInterval(cycleVideo, 8000);
        }, 3000);

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isExplorePage, enableVideoCycle, setIsYouTubeVisible]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <>
            {/* Video Background - cycle avec transition sympa */}
            {/* z-index: 0 pour être au-dessus du body mais sous les planètes */}
            <div 
                className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
                style={{ 
                    zIndex: 1,
                    opacity: isYouTubeVisible ? 1 : 0,
                        visibility: isYouTubeVisible ? 'visible' : 'hidden',
                    transition: 'opacity 1.5s ease-in-out', // Transition sympa de 1.5s
                    filter: (isExplorePage && grayscaleVideo) ? 'grayscale(100%)' : 'none', // Noir et blanc sur la page explore si activé
                }}
            >
                <iframe
                    key={isMuted ? 'muted' : 'unmuted'}
                    ref={iframeRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full"
                    src={videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ pointerEvents: 'none' }}
                />
            </div>

            {/* Sound toggle button - toujours visible */}
            <button
                onClick={toggleMute}
                className="fixed bottom-8 right-8 z-50 pointer-events-auto group"
                aria-label={isMuted ? "Activer le son" : "Désactiver le son"}
            >
                <div className="relative">
                    {/* Glassmorphism background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110" />
                    
                    {/* Icon */}
                    <div className="relative p-4">
                        {isMuted ? (
                            <VolumeX className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                            <Volume2 className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                        )}
                    </div>
                </div>
            </button>
        </>
    );
}



