import { FormData } from '@/types';

const fieldLabels: Record<keyof FormData, string> = {
    company: "Company",
    designation: "Designation",
    currentCTC: "Current CTC",
    totalYoEYears: "Total Years of Experience (Years)",
    totalYoEMonths: "Total Years of Experience (Months)",
    designationYoEYears: "Years in Current Role (Years)",
    designationYoEMonths: "Years in Current Role (Months)",
    performanceRating: "Performance Rating",
    employmentType: "Employment Type",
};

export const validateField = (name: keyof FormData, value: string): string => {
    if (!value.trim()) return `${fieldLabels[name]} is required`;

    switch (name) {
        case 'currentCTC':
        case 'totalYoEYears':
        case 'totalYoEMonths':
        case 'designationYoEYears':
        case 'designationYoEMonths':
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) return `Invalid ${fieldLabels[name]}`;
            if (name === 'currentCTC' && num > 150) return 'CTC seems unusually high';
            if ((name === 'totalYoEYears' || name === 'designationYoEYears') && num > 50) return 'Years of experience seems unusually high';
            if ((name === 'totalYoEMonths' || name === 'designationYoEMonths') && num >= 12) return 'Months should be less than 12';
            break;
        case 'company':
            if (value.length < 2) return 'Company name is too short';
            break;
        case 'designation':
            if (value.length < 2) return 'Designation is too short';
            break;
        case 'performanceRating':
            if (!['1', '2', '3', '4'].includes(value)) {
                return 'Please select a valid performance rating';
            }
            break;
        case 'employmentType':
            if (!['fulltime', 'intern'].includes(value)) {
                return 'Please select a valid employment type';
            }
            break;
    }
    return '';
};