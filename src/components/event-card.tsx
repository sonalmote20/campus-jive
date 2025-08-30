import Image from 'next/image';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { user } = useAppContext();
  return (
    <Card className="card-glass flex flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.name}
          fill
          className="object-cover"
          data-ai-hint="event photo"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-2xl text-primary">{event.name}</CardTitle>
            <Badge variant="secondary">{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={!user}>
            <Link href={`/bookings?eventId=${event.id}`}>{user ? 'Register Now' : 'Login to Register'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
