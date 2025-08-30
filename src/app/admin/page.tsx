import AdminGuard from '@/components/auth/admin-guard';
import AdminPanel from '@/components/sections/admin-panel';

export const metadata = {
  title: 'Admin Panel | Campus Jive',
  description: 'Manage events, categories, and bookings.',
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Admin Panel
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Manage campus events, categories, and view all bookings.
            </p>
        </header>
        <AdminPanel />
      </div>
    </AdminGuard>
  );
}
