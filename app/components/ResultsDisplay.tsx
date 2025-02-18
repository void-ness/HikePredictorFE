import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ResultsDisplayProps {
    result: {
        promotion_likelihood: boolean;
        min_hike: number;
        max_hike: number;
        confidence_score: number;
    };
    onReset: () => void;
}

const tips = [
    "Keep documentation of your achievements and discuss your career goals with your manager regularly.",
    "Seek feedback from peers and supervisors to continuously improve your performance.",
    "Take on new challenges and responsibilities to demonstrate your capabilities.",
    "Stay updated with industry trends and enhance your skills through continuous learning.",
    "Network with colleagues and industry professionals to expand your opportunities.",
    "Maintain a positive attitude and be a team player to build strong professional relationships.",
    "Set clear career goals and create a plan to achieve them.",
    "Be proactive in seeking out opportunities for growth and development.",
    "Showcase your problem-solving skills by taking initiative on projects.",
    "Communicate effectively and keep your manager informed about your progress and achievements."
];

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
    const [randomTip, setRandomTip] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * tips.length);
        setRandomTip(tips[randomIndex]);
    }, []);

    const getEmoji = () => result.promotion_likelihood ? '🎉' : '💪';
    const getMessage = () => {
        if (result.promotion_likelihood) {
            return "Good news! You're likely to be promoted!";
        }
        return "Keep up the great work! Continue building your skills.";
    };

    const formatHike = (hike: number): string => {
        if (hike >= 1 && hike <= 200) {
            return hike.toFixed(1) + '%';
        } else if (hike > 200) {
            let power = 0;
            while (hike > 200) {
                hike /= 10;
                power++;
            }
            return hike.toFixed(1) + `%`;
        } else {
            return (hike * 100).toFixed(1) + '%';
        }
    };

    return (
        <Card className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 mt-8 glass-card">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-black dark:text-white">
                    {getEmoji()} Your Results {getEmoji()}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                    <p className="text-xl font-semibold text-black dark:text-white">{getMessage()}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Confidence Score: {(result.confidence_score * 100).toFixed(1)}%
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-black dark:text-white">Expected Hike Range</h3>
                    <div className="flex justify-between items-center">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Minimum</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatHike(result.min_hike)}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-500" />
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Maximum</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatHike(result.max_hike)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 Tip: {randomTip}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={onReset} className="w-full">
                    Start New Prediction
                </Button>
            </CardFooter>
        </Card>
    );
};