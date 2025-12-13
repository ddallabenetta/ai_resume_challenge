import { useState, useEffect, useRef } from "react";

export function useAudioVisualizer(isSpeaking: boolean) {
    const [volume, setVolume] = useState<number>(0);
    const frameRef = useRef<number | null>(null);
    const targetVolumeRef = useRef(0);
    const currentVolumeRef = useRef(0);

    useEffect(() => {
        if (!isSpeaking) {
            // Decay to zero
            const animateOut = () => {
                currentVolumeRef.current *= 0.8; // Fast decay
                if (currentVolumeRef.current < 0.01) {
                    currentVolumeRef.current = 0;
                    setVolume(0);
                    return;
                }
                setVolume(currentVolumeRef.current);
                frameRef.current = requestAnimationFrame(animateOut);
            };

            frameRef.current = requestAnimationFrame(animateOut);
            return () => {
                if (frameRef.current) cancelAnimationFrame(frameRef.current);
            };
        }

        // Organic fluctuation logic
        const animate = () => {
            // Randomly change target volume occasionally to simulate speech cadence
            if (Math.random() > 0.8) {
                // Speech is usually 0.3 to 1.0, with some dips
                targetVolumeRef.current = Math.random() * 0.7 + 0.3;
            }

            // Sometimes dip low (pause between words)
            if (Math.random() > 0.95) {
                targetVolumeRef.current = 0.1;
            }

            // Smooth interpolation to target
            const diff = targetVolumeRef.current - currentVolumeRef.current;
            currentVolumeRef.current += diff * 0.15; // smooth factor

            setVolume(currentVolumeRef.current);
            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isSpeaking]);

    return volume;
}
