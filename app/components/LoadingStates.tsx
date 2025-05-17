import { useEffect, useState } from 'react';

const loadingMessages = [
    "Analyzing your profile...",
    "Checking industry standards...",
    "Consulting with AI manager...",
    "Calculating promotion probability...",
    "Finalizing recommendations...",
    "Crunching numbers...",
    "Fetching your hike prediction...",
    "Almost there...",
    "Good things take time!",
    "Calculating your next big move...",
    "Hang tight, magic is happening...",
    "Optimizing your future...",
    "Just a moment, success is near...",
    "Analyzing your data for the best result...",
    "Preparing your promotion insights...",
    "Your hike is being calculated...",
    "Dreaming up your next salary...",
    "Making HR jealous of your stats..."
];

export const LoadingStates: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-lg font-medium animate-pulse">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};