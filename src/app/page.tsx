
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, GalleryHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import { LoginDialog } from '@/components/auth/login-dialog';
import { useState } from 'react';
import AiSuggestionsDialog from '@/components/ai-suggestions-dialog';

export default function HomePage() {
  const { user } = useAppContext();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAiSuggestionsOpen, setIsAiSuggestionsOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl neon-text">
            Welcome to Campus Jive
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Your central hub for all campus events. Discover, register, and never miss out on what’s happening at your university.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/discover">
                Discover Events <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/gallery">
                View Gallery <GalleryHorizontal className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <AiSuggestionsDialog open={isAiSuggestionsOpen} onOpenChange={setIsAiSuggestionsOpen} />
    </>
  );
}
