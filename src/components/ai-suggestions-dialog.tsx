'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppContext } from '@/context/app-context';
import { suggestEvents } from '@/ai/flows/suggested-events';
import { Sparkles, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AiSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AiSuggestionsDialog({ open, onOpenChange }: AiSuggestionsDialogProps) {
  const { events, bookings, user } = useAppContext();
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions('');

    try {
      // Create mock profile and past events data
      const userProfile = user 
        ? `A ${user.role} with email ${user.email}.` 
        : 'A student interested in a variety of campus activities.';
      
      const userBookings = bookings.filter(b => b.custEmail === user?.email);
      const pastEvents = userBookings.length > 0
        ? `The user has previously booked: ${userBookings.map(b => b.eventName).join(', ')}.`
        : 'The user has no past event history.';
      
      const allEvents = events.map(e => `${e.name} (${e.category}): ${e.description}`).join('\n');
      
      const result = await suggestEvents({ userProfile, pastEvents, allEvents });
      setSuggestions(result.suggestedEvents);

    } catch (e) {
      console.error(e);
      setError('Sorry, we couldn\'t generate suggestions at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            AI Event Suggestions
          </DialogTitle>
          <DialogDescription>
            Let our AI find events you'll love based on your profile and activity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 min-h-[120px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : suggestions ? (
             <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{suggestions}</p>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                Click "Generate" to get your personalized event suggestions.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" onClick={getSuggestions} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
