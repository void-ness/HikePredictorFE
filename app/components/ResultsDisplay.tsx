import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ResultsDisplayProps {
    result: {
        promotion_likelihood: boolean;
        min_hike: number;
        max_hike: number;
        confidence_score: number;
        predictionId?: number;
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
    "Communicate effectively and keep your manager informed about your progress and achievements.",
    "Obtain relevant certifications or advanced degrees to increase your market value.",
    "Volunteer for high-visibility projects that align with company strategic goals.",
    "Build cross-functional relationships to understand different aspects of the business.",
    "Develop leadership skills by mentoring junior colleagues or leading team initiatives.",
    "Create measurable impact by setting and achieving specific performance KPIs.",
    "Present your ideas and solutions to senior leadership to increase your visibility.",
    "Learn complementary skills that make you more versatile and valuable to the organization.",
    "Seek stretch assignments that push you outside your comfort zone.",
    "Build a personal brand within your organization through thought leadership and expertise.",
    "Understand your company's promotion criteria and create a development plan to meet them.",
    "Establish yourself as a subject matter expert in key areas relevant to your role.",
    "Actively participate in company-wide initiatives and committees.",
    "Develop strong analytical skills to make data-driven decisions and recommendations.",
    "Cultivate emotional intelligence to better manage relationships and team dynamics.",
    "Stay informed about your industry's salary trends and negotiate effectively during reviews.",
    "Build a portfolio of successful projects that demonstrate your impact on business outcomes.",
    "Seek international experience or work on global projects to broaden your perspective.",
    "Develop public speaking and presentation skills to effectively communicate your value.",
    "Create and maintain strategic partnerships both within and outside your organization.",
    "Focus on developing skills that are future-proof and aligned with emerging industry trends."
];

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
    const [randomTip, setRandomTip] = useState('');
    const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * tips.length);
        setRandomTip(tips[randomIndex]);
    }, []);

    const handleFeedback = async (liked: boolean) => {
        const predictionId = result.predictionId || localStorage.getItem('currentPredictionId');

        if (!predictionId) {
            console.error('No prediction ID available');
            return;
        }

        setIsSubmittingFeedback(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/predictions/${predictionId}/feedback`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ liked }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setFeedbackGiven(liked);

            // Track feedback in analytics if available
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'prediction_feedback', {
                    event_category: 'engagement',
                    event_label: liked ? 'thumbs_up' : 'thumbs_down',
                    prediction_id: predictionId,
                });
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

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

                {feedbackGiven === null ? (
                    <div className="space-y-3">
                        <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            Did this prediction match your expectations?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => handleFeedback(true)}
                                disabled={isSubmittingFeedback}
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-500 dark:hover:bg-green-900/20"
                            >
                                <ThumbsUp className="w-5 h-5" />
                                Yes
                            </Button>
                            <Button
                                onClick={() => handleFeedback(false)}
                                disabled={isSubmittingFeedback}
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-500 dark:hover:bg-red-900/20"
                            >
                                <ThumbsDown className="w-5 h-5" />
                                No
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-sm text-green-700 dark:text-green-300">
                            ✓ Thank you for your feedback!
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={onReset} className="w-full">
                    Start New Prediction
                </Button>
            </CardFooter>
        </Card>
    );
};