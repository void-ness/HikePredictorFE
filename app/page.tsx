'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const handleCheckHikeClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'check_hike_button_click', {
        event_category: 'engagement',
        event_label: 'Start checking Hike',
      });
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 via-[#0a0a0a] to-purple-900/40" />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] animate-pulse delay-700" />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 dark:opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold mb-6 lg:mb-4 text-white animate-fade-in">
          Welcome to the Hike Calculator
        </h1>
        <p className="text-xl mb-2 md:mb-1 font-light text-white animate-fade-in delay-200">
          Curious about your next salary hike?
        </p>
        <p className="text-xl mb-8 font-light text-white animate-fade-in delay-200">
          Use our tool to predict your promotion and hike.
        </p>
        <Link href="/predict">
          <Button
            className="text-xl px-8 py-4 animate-bounce-smooth"
            onClick={handleCheckHikeClick}
          >
            Check Your Hike
          </Button>
        </Link>
      </div>
    </main>
  );
}