'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { LoadingStates } from './LoadingStates';
import { ResultsDisplay } from './ResultsDisplay';
import { validateField } from '@/utils/validation';
import type { FormData, Stage, Field } from '@/types';

interface PredictionResult {
    promotion_likelihood: boolean;
    min_hike: number;
    max_hike: number;
    confidence_score: number;
}

const PromotionPredictorForm: React.FC = () => {
    const [stage, setStage] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        company: '',
        designation: '',
        currentCTC: '',
        totalYoE: '',
        designationYoE: '',
        performanceRating: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);

    const stages: Stage[] = [
        {
            title: 'Company Details',
            fields: [
                { name: 'company', label: 'Company Name', type: 'text' },
                { name: 'designation', label: 'Current Designation', type: 'text' }
            ]
        },
        {
            title: 'Experience & Compensation',
            fields: [
                { name: 'currentCTC', label: 'Current CTC (in lakhs)', type: 'number' },
                { name: 'totalYoE', label: 'Total Years of Experience', type: 'number' },
                { name: 'designationYoE', label: 'Years in Current Role', type: 'number' }
            ]
        },
        {
            title: 'Performance',
            fields: [
                {
                    name: 'performanceRating',
                    label: 'Annual Performance Rating',
                    type: 'select',
                    options: [
                        { value: 'outstanding', label: 'Outstanding' },
                        { value: 'exceeds', label: 'Exceeds Expectations' },
                        { value: 'meets', label: 'Meets Expectations' },
                        { value: 'needsImprovement', label: 'Needs Improvement' }
                    ]
                }
            ]
        }
    ];

    const validateStage = (stageIndex: number): boolean => {
        const currentFields = stages[stageIndex].fields;
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        let isValid = true;

        currentFields.forEach((field) => {
            const error = validateField(field.name, formData[field.name]);
            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStage(stage)) {
            setStage(prev => prev + 1);
        }
    };

    const handleInputChange = (name: keyof FormData, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!validateStage(stage)) return;

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(apiUrl as string, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const predictionResult: PredictionResult = await response.json();
            setResult(predictionResult);
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            company: '',
            designation: '',
            currentCTC: '',
            totalYoE: '',
            designationYoE: '',
            performanceRating: ''
        });
        setStage(0);
        setResult(null);
        setErrors({});
    };

    if (result) {
        return <ResultsDisplay result={result} onReset={resetForm} />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <LoadingStates />
            </div>
        );
    }

    const currentStage = stages[stage];

    const renderField = (field: Field) => {
        if (field.type === 'select' && field.options) {
            return (
                <Select
                    value={formData[field.name]}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        return (
            <Input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full"
                placeholder={`Enter ${field.label.toLowerCase()}`}
            />
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-xl glass-card">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {currentStage.title}
                    </CardTitle>
                    <div className="flex gap-2 mt-4">
                        {stages.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 flex-1 rounded-full transition-colors ${index <= stage ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </CardHeader>


                <CardContent className="space-y-6">
                    {currentStage.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            {renderField(field)}
                            {errors[field.name] && (
                                <p className="text-sm text-red-500">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setStage(prev => prev - 1)}
                        disabled={stage === 0}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    {stage === stages.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            className="gap-2"
                        >
                            Get Prediction
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="gap-2"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default PromotionPredictorForm;