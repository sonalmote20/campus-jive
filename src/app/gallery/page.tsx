import Gallery from '@/components/sections/gallery';

export const metadata = {
  title: 'Gallery | Campus Jive',
  description: 'A collection of photos from our campus events.',
};

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Event Gallery
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Relive the moments from our amazing campus events.
        </p>
      </header>
      <Gallery />
    </div>
  );
}
