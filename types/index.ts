export interface FormData {
    company: string;
    designation: string;
    currentCTC: string;
    totalYoEYears: string;
    totalYoEMonths: string;
    designationYoEYears: string;
    designationYoEMonths: string;
    performanceRating: string;
    employmentType: string;
}

export interface Field {
    name: keyof FormData;
    label: string;
    type: string;
    options?: { value: string; label: string; }[];
}

export interface Stage {
    title: string;
    fields: Field[];
}

export interface PredictionResult {
    promotionLikelihood: boolean;
    minHike: number;
    maxHike: number;
    confidenceScore: number;
}