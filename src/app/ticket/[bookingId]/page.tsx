import Ticket from '@/components/ticket';

export const metadata = {
  title: 'Your Ticket | Campus Jive',
  description: 'Your digital ticket for the event.',
};

export default function TicketPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="container mx-auto flex items-center justify-center p-4 py-12">
        <Ticket bookingId={params.bookingId} />
    </div>
  );
}

