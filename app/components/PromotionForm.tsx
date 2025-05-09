'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { LoadingStates } from './LoadingStates';
import { ResultsDisplay } from './ResultsDisplay';
import { InternPrompt } from './InternPrompt';
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
        totalYoEYears: '',
        totalYoEMonths: '',
        designationYoEYears: '',
        designationYoEMonths: '',
        performanceRating: '',
        employmentType: ''
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
                { name: 'totalYoEYears', label: 'Total Years of Experience (Years)', type: 'number' },
                { name: 'totalYoEMonths', label: 'Total Years of Experience (Months)', type: 'number' },
                { name: 'designationYoEYears', label: 'Years in Current Role (Years)', type: 'number' },
                { name: 'designationYoEMonths', label: 'Years in Current Role (Months)', type: 'number' }
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
                        { value: '4', label: 'Outstanding' },
                        { value: '3', label: 'Exceeds Expectations' },
                        { value: '2', label: 'Meets Expectations' },
                        { value: '1', label: 'Needs Improvement' }
                    ]
                },
                {
                    name: 'employmentType',
                    label: 'Employment Type',
                    type: 'select',
                    options: [
                        { value: 'fulltime', label: 'Fulltime' },
                        { value: 'intern', label: 'Intern' }
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

        window.gtag('event', 'predict_button_click', {
            event_category: 'engagement',
            event_label: 'start_prediction',
        })

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            // Convert years and months to total years
            const totalYoE = parseFloat(formData.totalYoEYears) + parseFloat(formData.totalYoEMonths) / 12;
            const designationYoE = parseFloat(formData.designationYoEYears) + parseFloat(formData.designationYoEMonths) / 12;

            const dataToSend = {
                ...formData,
                totalYoE: totalYoE.toFixed(2),
                designationYoE: designationYoE.toFixed(2),
                performanceRating: parseInt(formData.performanceRating)
            };

            const response = await fetch(apiUrl as string, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
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
            totalYoEYears: '',
            totalYoEMonths: '',
            designationYoEYears: '',
            designationYoEMonths: '',
            performanceRating: '',
            employmentType: ''
        });
        setStage(0);
        setResult(null);
        setErrors({});

        window.gtag('event', 'reset_form_button_click', {
            event_category: 'engagement',
            event_label: 'reset_prediction',
        })
    };

    if (result) {
        if (formData.employmentType === 'intern') {
            return <InternPrompt onReset={resetForm} />;
        }
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
                    {currentStage.fields.map((field) => {
                        if (field.name === 'totalYoEYears' || field.name === 'totalYoEMonths' || field.name === 'designationYoEYears' || field.name === 'designationYoEMonths') {
                            return null; // Skip rendering these fields individually
                        }
                        return (
                            <div key={field.name} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    {field.label}
                                </label>
                                {renderField(field)}
                                {errors[field.name] && (
                                    <p className="text-sm text-red-500">{errors[field.name]}</p>
                                )}
                            </div>
                        );
                    })}

                    {/* Render total years of experience fields with a single heading */}
                    {stage === 1 && (
                        <div className="space-y-4">
                            <label className="text-lg font-medium text-gray-700">
                                Total Years of Experience
                            </label>
                            <div className="flex space-x-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Years
                                    </label>
                                    {renderField({ name: 'totalYoEYears', label: 'Years', type: 'number' })}
                                    {errors.totalYoEYears && (
                                        <p className="text-sm text-red-500">{errors.totalYoEYears}</p>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Months
                                    </label>
                                    {renderField({ name: 'totalYoEMonths', label: 'Months', type: 'number' })}
                                    {errors.totalYoEMonths && (
                                        <p className="text-sm text-red-500">{errors.totalYoEMonths}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Render years in current role fields with a single heading */}
                    {stage === 1 && (
                        <div className="space-y-4">
                            <label className="text-lg font-medium text-gray-700">
                                Years in Current Role
                            </label>
                            <div className="flex space-x-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Years
                                    </label>
                                    {renderField({ name: 'designationYoEYears', label: 'Years', type: 'number' })}
                                    {errors.designationYoEYears && (
                                        <p className="text-sm text-red-500">{errors.designationYoEYears}</p>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Months
                                    </label>
                                    {renderField({ name: 'designationYoEMonths', label: 'Months', type: 'number' })}
                                    {errors.designationYoEMonths && (
                                        <p className="text-sm text-red-500">{errors.designationYoEMonths}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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