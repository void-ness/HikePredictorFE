import { useEffect, useState } from 'react';

const loadingMessages = [
    "Analyzing your career profile and performance metrics...",
    "Cross-referencing with industry salary benchmarks...",
    "Processing years of experience and skill assessments...",
    "Evaluating promotion eligibility based on market trends...",
    "Reviewing performance indicators and growth patterns...",
    "Comparing your profile with successful promotion cases...",
    "Analyzing market demand for your skill set...",
    "Processing organizational hierarchy and promotion paths...",
    "Evaluating compensation bands for your role level...",
    "Running predictive models on career advancement data...",
    "Assessing your competitive positioning in the market...",
    "Calculating salary increment based on performance metrics...",
    "Processing tenure, achievements, and growth trajectory...",
    "Analyzing peer comparison and industry standards...",
    "Evaluating skill gaps and advancement opportunities...",
    "Computing confidence scores for prediction accuracy...",
    "Finalizing personalized career advancement insights...",
    "Generating your comprehensive promotion forecast...",
    "Preparing detailed salary hike recommendations..."
];

export const LoadingStates: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const scheduleNextMessage = () => {
            // Random delay between 600ms to 2200ms to simulate realistic processing times
            const randomDelay = Math.random() * 1600 + 600;

            timeoutId = setTimeout(() => {
                // Generate a random index instead of sequential
                const randomIndex = Math.floor(Math.random() * loadingMessages.length);
                setMessageIndex(randomIndex);
                scheduleNextMessage(); // Schedule the next message
            }, randomDelay);
        };

        // Start the first message change
        scheduleNextMessage();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
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