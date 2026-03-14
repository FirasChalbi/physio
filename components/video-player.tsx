"use client"
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Share2, MessageCircle, Fullscreen } from 'lucide-react'

import AnimatedHeart from './animated-heart'

interface VideoPlayerProps {
    url: string
    originalUrl: string
    initialLikes: number
    initialVues: number
    className?: string
    isActive?: boolean
    shouldPreload?: boolean
    autoPlay?: boolean
    index?: number
    swiperRef?: React.RefObject<any>
}

export default function VideoPlayer({
    url,
    originalUrl,
    initialLikes,
    initialVues,
    className = '',
    isActive = false,
    shouldPreload = false,
    autoPlay = false,
    index,
    swiperRef
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [isLiked, setIsLiked] = useState(true)
    const [likeCount, setLikeCount] = useState(initialLikes)
    const [vueCount, setVueCount] = useState(initialVues)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return;

        const currentContainer = containerRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.3 }
        );

        observer.observe(currentContainer);
        return () => {
            observer.unobserve(currentContainer);
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        const currentVideo = videoRef.current;

        if (isActive && isVisible) {
            if (!currentVideo.src || currentVideo.src === '') {
                currentVideo.src = url;
                currentVideo.load();
            }
            currentVideo.preload = "auto";
            
            if (autoPlay) {
                currentVideo.play().catch((error) => {
                    console.error('Error auto-playing video:', error);
                });
            }

            const handleLoadedMetadata = () => {
                setIsLoaded(true);
                setIsLoading(false);
            };

            currentVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => {
                currentVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        } else {
            currentVideo.preload = "none";
            if (isPlaying) {
                currentVideo.pause();
            }
        }
    }, [isActive, isVisible, autoPlay, url]);

    useEffect(() => {
        if (!videoRef.current || !isLoaded) return;

        const currentVideo = videoRef.current;

        if (isActive && isVisible) {
            currentVideo.play().catch(error => {
                console.error('Error playing video:', error);
            });
        } else if (!isActive) {
            currentVideo.pause();
        }
    }, [isActive, isLoaded, isVisible]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const toggleFullScreen = () => {
        if (videoRef.current) {
            videoRef.current.requestFullscreen()
        }
    }

    useEffect(() => {
        if (!videoRef.current) return;

        const currentVideo = videoRef.current;

        currentVideo.muted = true;

        if (isActive && isVisible) {
            currentVideo.play().catch((error) => {
                console.error('Error attempting to play', error);
            });
        }

        const onLoadedData = () => setIsLoaded(true);
        const onError = (event: Event) => console.error('Error loading video:', event);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        currentVideo.addEventListener('loadeddata', onLoadedData);
        currentVideo.addEventListener('error', onError);
        currentVideo.addEventListener('play', onPlay);
        currentVideo.addEventListener('pause', onPause);

        return () => {
            currentVideo.removeEventListener('loadeddata', onLoadedData);
            currentVideo.removeEventListener('error', onError);
            currentVideo.removeEventListener('play', onPlay);
            currentVideo.removeEventListener('pause', onPause);
        };
    }, [isActive, isVisible]);

    const handleLike = () => {
        setIsLiked(prev => !prev)
        setLikeCount(prev => prev + 1)
    }

    const handleShare = () => {
        setVueCount(prev => prev + 1)
    }

    return (
        <div
            ref={containerRef}
            className={`relative group bg-black rounded-xl overflow-hidden transition-all duration-300 h-full ${!isActive ? 'opacity-70 hover:opacity-90 scale-95 hover:scale-98' : 'opacity-100 scale-100'
                }`}
            style={{ aspectRatio: '9/16', maxHeight: '650px', height: '100%' }}
        >
            <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo2.jpg"
                        alt="heavenGlow"
                        width={32}
                        height={32}
                        className="rounded-full border border-white/20"
                    />
                    <Link href="https://www.instagram.com/institut_physio/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-sm font-medium hover:underline flex items-center gap-2">
                        Institut.Physio 
                        {/* We removed the explicit seal.avif image assumption or uncomment if image exists */}
                    </Link>
                </div>
            </div>

            <video
                ref={videoRef}
                data-src={url}
                loop
                playsInline
                title="Video Player"
                aria-label="Video Player"
                muted={isMuted}
                preload="none"
                className={`w-full h-full object-cover rounded-xl ${className}`}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={() => {
                    setIsLoaded(true);
                    setIsLoading(false);
                }}
                onError={() => {
                    console.error('Error loading video:', url);
                    setIsLoading(false);
                }}
                onClick={togglePlay}
            />

            {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                    <div className="flex flex-col items-center gap-3">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
                        <p className="text-white text-sm font-medium">Chargement...</p>
                    </div>
                </div>
            )}

            <div className={`absolute bottom-24 right-0 pr-1 flex flex-col gap-4 z-20 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={togglePlay}
                    className="bg-black/50 backdrop-blur-xs p-2 rounded-full hover:bg-black/50 transition"
                    title="Play/Pause"
                    aria-label="Play/Pause"
                >
                    {isPlaying ? <Pause className="text-white w-4 h-4" /> : <Play className="text-white w-4 h-4" />}
                </button>
                <button
                    onClick={toggleMute}
                    className="bg-black/50 backdrop-blur-xs p-2 rounded-full hover:bg-black/50 transition"
                    title="Mute"
                    aria-label="Mute"
                >
                    {isMuted ? <VolumeX className="text-white w-4 h-4" /> : <Volume2 className="text-white w-4 h-4" />}
                </button>
                <button
                    onClick={toggleFullScreen}
                    className="bg-black/50 backdrop-blur-xs p-2 rounded-full hover:bg-black/50 transition"
                    title="Fullscreen"
                    aria-label="Fullscreen"
                >
                    <Fullscreen className="text-white w-4 h-4" />
                </button>
            </div>

            {!isActive && !isLoading && (
                <div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => {
                        if (swiperRef && swiperRef.current && typeof swiperRef.current.slideTo === 'function' && typeof index === 'number') {
                            swiperRef.current.slideTo(index);
                        }
                    }}
                >
                    <div className="bg-white/20 backdrop-blur-xs p-3 rounded-full">
                        <Play className="text-white w-8 h-8" />
                    </div>
                </div>
            )}

            <div className={`absolute bottom-0 left-0 right-0 px-4 pb-2 flex flex-col gap-1 items-start z-20 bg-gradient-to-t from-black to-transparent ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-4">
                    <AnimatedHeart isLiked={isLiked} onClick={handleLike} />
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        className="text-white hover:scale-110 transition-transform bg-black/10 backdrop-blur-xs p-1 rounded-full hover:bg-black/50"
                        aria-label="Commentaire"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={handleShare}
                        className="text-white hover:scale-110 transition-transform bg-black/10 backdrop-blur-xs p-1 rounded-full hover:bg-black/50"
                        aria-label="Partager"
                    >
                        <Share2 className="w-4 h-4" />
                    </motion.button>
                </div>

                <div className="flex justify-between items-center w-full">
                    <div className="text-white/80 text-xs">
                        {likeCount.toLocaleString('en-US')} j'aime
                    </div>
                    <div className="text-white/80 text-xs">
                        {vueCount.toLocaleString('en-US')} vues
                    </div>
                </div>
            </div>
        </div>
    )
}
