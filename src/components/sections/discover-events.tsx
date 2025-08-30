'use client';
import { useAppContext } from '@/context/app-context';
import EventCard from '@/components/event-card';

export default function DiscoverEvents() {
    const { events } = useAppContext();

    return (
        <>
            {events.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border">
                    <p className="text-muted-foreground">No events found. Check back later!</p>
                </div>
            )}
        </>
    );
}
