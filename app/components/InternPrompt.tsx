import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface InternPromptProps {
    onReset: () => void;
}

export const InternPrompt: React.FC<InternPromptProps> = ({ onReset }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Interns must first secure a PPO 🫣</h1>
            <div className="relative w-5/6 md:w-3/5 lg:w-2/5 h-52 md:h-80 rounded-xl">
                <Image src="/images/jokes.jpg" className='object-contain md:object-fill rounded-xl' alt="Jokes" fill={true} />
            </div>
            <p className="text-center my-6">Please works towards obtaining a Pre-Placement Offer (PPO) before proceeding further.</p>
            <Button onClick={onReset} className="gap-2">
                Reset Form
            </Button>
        </div>
    );
};