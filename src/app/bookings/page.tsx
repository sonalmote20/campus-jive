import { Suspense } from "react";
import MyBookings from '@/components/sections/my-bookings';

export const metadata = {
  title: 'My Bookings | Campus Jive',
  description: 'Book new events or view your existing bookings.',
};

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Event Registration
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Request to join an upcoming event or manage your existing registrations.
        </p>
      </header>

      {/* ✅ Suspense wrapper fixes the build error */}
      <Suspense fallback={<div>Loading bookings...</div>}>
        <MyBookings />
      </Suspense>
    </div>
  );
}
