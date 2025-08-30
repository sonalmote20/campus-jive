import DiscoverEvents from '@/components/sections/discover-events';

export const metadata = {
  title: 'Discover Events | Campus Jive',
  description: 'Explore all upcoming events on campus.',
};

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Discover Events
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Find your next experience. Here’s what’s happening on campus.
        </p>
      </header>
      <DiscoverEvents />
    </div>
  );
}
