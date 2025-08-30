
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Button } from './ui/button';
import type { Booking } from '@/lib/types';
import { ArrowLeft, Ban, CheckCircle, Users } from 'lucide-react';

export default function Ticket({ bookingId }: { bookingId: string }) {
  const { bookings, user } = useAppContext();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [participantNumber, setParticipantNumber] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    const foundBooking = bookings.find((b) => b.id === bookingId);
    if (foundBooking) {
      setBooking(foundBooking);
      
      const approvedBookingsForEvent = bookings.filter(
        b => b.eventId === foundBooking.eventId && b.status === 'approved'
      );
      
      const sortedBookings = approvedBookingsForEvent.sort((a,b) => (a.id > b.id) ? 1 : -1);
      
      setTotalParticipants(sortedBookings.length);
      const userIndex = sortedBookings.findIndex(b => b.id === bookingId);
      if(userIndex !== -1){
        setParticipantNumber(userIndex + 1);
      }
      
      // Admin can view any ticket, student can only view their own.
      if (user?.role === 'admin' || (user?.email === foundBooking.custEmail && foundBooking.status === 'approved')) {
        setIsAuthorized(true);
      }
    }
    setLoading(false);
  }, [bookingId, bookings, user]);

  if (loading) {
    return <Skeleton className="w-full max-w-md h-96" />;
  }

  if (!booking) {
    return (
      <Card className="card-glass w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">Ticket Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This booking could not be found. It might have been canceled or the link is incorrect.</p>
           <Button asChild variant="link" className="mt-4">
              <Link href="/bookings">Go to My Bookings</Link>
           </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthorized) {
    return (
        <Card className="card-glass w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl text-destructive flex items-center justify-center gap-2">
                    <Ban /> Access Denied
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    You are not authorized to view this ticket. Your booking may still be pending, was rejected, or this is not your ticket.
                </p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/bookings">Go to My Bookings</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="card-glass w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 text-green-400">
            <CheckCircle size={24} />
            <p className="text-lg">Registration Successfully Done</p>
        </div>
        <CardTitle className="text-3xl font-bold text-primary">Your Digital Ticket</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="ticket relative p-6 bg-gray-900/50 border-2 border-dashed border-primary rounded-xl mt-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background h-6 w-12 rounded-full border-2 border-dashed border-primary border-t-0"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-background h-6 w-12 rounded-full border-2 border-dashed border-primary border-b-0"></div>
          
          <h3 className="text-xl font-bold mb-2 text-primary">{booking.eventName}</h3>
          
           <div className="flex justify-around items-center my-4 text-sm text-gray-300">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">#{participantNumber}</span>
                    <span className="text-xs text-gray-400">Your Number</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{totalParticipants}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12}/> Participants</span>
                </div>
           </div>

          <div className="my-6 space-y-2">
            <p className="text-lg font-semibold text-gray-200">
              <span className="text-gray-400">Name:</span> {booking.custName}
            </p>
            <p className="text-lg font-semibold text-gray-200">
               <span className="text-gray-400">Email:</span> {booking.custEmail}
            </p>
          </div>
          <div className="flex justify-center">
             <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${booking.id}&bgcolor=ffffff&color=000000`}
                alt="QR Code"
                width={180}
                height={180}
                className="rounded-md"
                data-ai-hint="qr code"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">Present this at the event entrance.</p>
        </div>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/bookings"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Bookings</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
