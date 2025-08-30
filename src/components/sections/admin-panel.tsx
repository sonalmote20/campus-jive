'use client';

import { useState, useRef } from 'react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Check, X, Upload, Download, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

export default function AdminPanel() {
  const {
    categories, addCategory, deleteCategory,
    events, addEvent, deleteEvent,
    bookings, updateBookingStatus,
    updateBackgroundVideo,
    studentPin, updateStudentPin,
  } = useAppContext();
  const { toast } = useToast();

  const [catName, setCatName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [newPin, setNewPin] = useState(studentPin);
  const [showPin, setShowPin] = useState(false);

  const handleAddCategory = () => {
    if (!catName) {
        toast({ variant: 'destructive', title: 'Error', description: 'Category name cannot be empty.' });
        return;
    }
    addCategory({ name: catName });
    setCatName('');
    toast({ title: 'Success', description: 'Category added.'});
  };

  const handleAddEvent = () => {
    if (!eventName || !eventCategory || !eventDescription) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all event fields.' });
        return;
    }
    addEvent({ name: eventName, category: eventCategory, description: eventDescription });
    setEventName('');
    setEventCategory('');
    setEventDescription('');
    toast({ title: 'Success', description: 'Event added.'});
  };
  
  const handleUpdateStatus = (bookingId: string, status: 'approved' | 'rejected') => {
    updateBookingStatus(bookingId, status);
    toast({
      title: 'Status Updated',
      description: `Booking has been ${status}.`,
    });
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateBackgroundVideo(e.target.result as string);
          toast({ title: 'Success', description: 'Background video updated.' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadParticipants = () => {
    if (!selectedEventId || selectedEventId === 'all') return;

    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return;

    const participants = bookings.filter(
      (b) => b.eventId === selectedEventId && b.status === 'approved'
    );

    if (participants.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Participants',
        description: 'There are no approved participants for this event yet.',
      });
      return;
    }

    const csvContent = [
      'Name,Email', // CSV Header
      ...participants.map((p) => `${p.custName},${p.custEmail}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${selectedEvent.name.replace(/\s+/g, '_').toLowerCase()}_participants.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleUpdatePin = () => {
    if (!/^\S{4,}$/.test(newPin)) {
        toast({ variant: 'destructive', title: 'Invalid PIN', description: 'PIN must be at least 4 characters long.' });
        return;
    }
    updateStudentPin(newPin);
    toast({ title: 'Success', description: `Student security PIN has been updated.` });
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

  const filteredBookings = selectedEventId === 'all'
    ? bookings
    : bookings.filter((b) => b.eventId === selectedEventId);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
      {/* Column 1: Manage Org */}
      <div className="space-y-8 xl:col-span-1">
         <Card className="card-glass">
          <CardHeader><CardTitle className="text-2xl text-primary">Student Security</CardTitle></CardHeader>
          <CardContent>
             <Label htmlFor="student-pin">Global Security PIN</Label>
              <div className="relative flex gap-2">
                <Input
                  id="student-pin"
                  type={showPin ? 'text' : 'password'}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN"
                />
                 <Button type="button" variant="ghost" size="icon" className="absolute right-12 h-7 w-7 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPin(!showPin)}>
                    {showPin ? <EyeOff /> : <Eye />}
                </Button>
                <Button onClick={handleUpdatePin}><Key /></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">This single PIN is used by all students to log in.</p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardHeader><CardTitle className="text-2xl text-primary">Manage Appearance</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Background Video</Label>
              <Button variant="outline" className="w-full" onClick={() => videoInputRef.current?.click()}><Upload className="mr-2" /> Upload New Video</Button>
              <Input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
              <p className="text-xs text-muted-foreground">Change the background video for the entire site.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardHeader><CardTitle className="text-2xl text-primary">Manage Categories</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input placeholder="New Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Column 2: Manage Content & Users */}
      <div className="space-y-8 xl:col-span-2">
        <Card className="card-glass">
          <CardHeader><CardTitle className="text-2xl text-primary">Manage Events</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="New Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <Select value={eventCategory} onValueChange={setEventCategory}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Event Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            <Button onClick={handleAddEvent} className="w-full">Add Event</Button>
            <Table>
              <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>{ev.name}</TableCell>
                    <TableCell>{ev.category}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => deleteEvent(ev.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Row: Bookings */}
      <Card className="card-glass xl:col-span-3">
        <CardHeader><CardTitle className="text-2xl text-primary">All Bookings</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger><SelectValue placeholder="Filter by event..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (<SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button onClick={handleDownloadParticipants} disabled={!selectedEventId || selectedEventId === 'all'} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download List (CSV)
            </Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.eventName}</TableCell>
                  <TableCell>{b.custEmail}</TableCell>
                  <TableCell><Badge variant={getStatusVariant(b.status)} className="capitalize">{b.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {b.status === 'pending' ? (
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(b.id, 'approved')}><Check className="h-4 w-4 text-green-500" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(b.id, 'rejected')}><X className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    ) : (<span className="text-xs text-muted-foreground">Done</span>)}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={4} className="h-24 text-center">No bookings found for the selected event.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
