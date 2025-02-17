import { FormData } from '@/types';

const fieldLabels: Record<keyof FormData, string> = {
    company: "Company",
    designation: "Designation",
    currentCTC: "Current CTC",
    totalYoE: "Total Years of Experience",
    designationYoE: "Years in Current Role",
    performanceRating: "Performance Rating"
};

export const validateField = (name: keyof FormData, value: string): string => {
    if (!value.trim()) return `${fieldLabels[name]} is required`;

    switch (name) {
        case 'currentCTC':
        case 'totalYoE':
        case 'designationYoE':
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) return `Invalid ${fieldLabels[name]}`;
            if (name === 'currentCTC' && num > 100) return 'CTC seems unusually high';
            if (name === 'totalYoE' && num > 50) return 'Years of experience seems unusually high';
            break;
        case 'company':
            if (value.length < 2) return 'Company name is too short';
            break;
        case 'designation':
            if (value.length < 2) return 'Designation is too short';
            break;
        case 'performanceRating':
            if (!['outstanding', 'exceeds', 'meets', 'needsImprovement'].includes(value)) {
                return 'Please select a valid performance rating';
            }
            break;
    }
    return '';
};