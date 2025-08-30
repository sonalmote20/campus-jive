'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Lock } from 'lucide-react';

export default function MyBookings() {
  const { events, bookings, addBooking, user } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  const [searchEmail, setSearchEmail] = useState('');
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (eventId) {
      setSelectedEventId(eventId);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (user) {
      setCustName(user.name || '');
      setCustEmail(user.email || '');
      if(user.role === 'student'){
        const email = user.email || '';
        setSearchEmail(email);
        handleViewMyBookings(email);
      }
    } else {
        setCustName('');
        setCustEmail('');
        setSearchEmail('');
        setMyBookings([]);
    }
  }, [user, bookings]);


  const handleBookEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ variant: 'destructive', title: 'Login Required', description: 'You must be logged in to register for an event.' });
        return;
    }
    if (!custName || !custEmail || !selectedEventId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all fields to book an event.',
      });
      return;
    }
    const eventName = events.find(e => e.id === selectedEventId)?.name || '';
    addBooking({ custName, custEmail, eventId: selectedEventId, eventName });
    
    toast({
      title: 'Request Sent!',
      description: `Your request to join ${eventName} is pending approval.`,
    });

    setSelectedEventId('');
  };

  const handleViewMyBookings = (emailToSearch: string) => {
    if (!emailToSearch) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter an email to search for bookings.',
      });
      setMyBookings([]);
      return;
    }
    const foundBookings = bookings.filter((b) => b.custEmail.toLowerCase() === emailToSearch.toLowerCase());
    setMyBookings(foundBookings);
  };

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <Card className="card-glass lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Register for an Event</CardTitle>
          {!user && (
            <CardDescription>Please log in to register for an event.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookEvent} className="space-y-6">
            <fieldset disabled={!user} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custName">Full Name</Label>
                <Input
                  id="custName"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Set your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custEmail">Email Address</Label>
                <Input
                  id="custEmail"
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  required
                  disabled={!!user?.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookEvent">Select Event</Label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId} required>
                  <SelectTrigger id="bookEvent">
                    <SelectValue placeholder="Choose an event..." />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
            <Button type="submit" className="w-full !mt-8" disabled={!user}>
                { !user && <Lock className="mr-2" /> }
                { user ? 'Request to Register' : 'Login to Register' }
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="card-glass lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">View My Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter your email to search..."
              disabled={user?.role === 'student'}
            />
            <Button variant="secondary" onClick={() => handleViewMyBookings(searchEmail)} disabled={user?.role === 'student'}>Search</Button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ticket</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBookings.length > 0 ? (
                  myBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.eventName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.status === 'approved' ? (
                            <Button variant="link" size="sm" onClick={() => router.push(`/ticket/${booking.id}`)}>View Ticket</Button>
                        ) : (
                           <span className="text-xs text-muted-foreground">Not Available</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      {user ? 
                        (searchEmail ? "No bookings found for this email." : "Your bookings will appear here.") :
                        "Log in and search for your bookings by email."
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
