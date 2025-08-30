'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/auth/login-dialog';
import { Menu, Ticket, User as UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/discover', label: 'Discover Events' },
  { href: '/bookings', label: 'My Bookings' },
  { href: '/gallery', label: 'Gallery' },
];

export default function Header() {
  const { user, logout, loading } = useAppContext();
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string; }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'transition-colors hover:text-primary',
        pathname === href ? 'text-primary font-bold' : 'text-foreground/80'
      )}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Campus Jive</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            {user?.role === 'admin' && <NavLink href="/admin" label="Admin" />}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-4">
            {loading ? (
                <Skeleton className='h-8 w-24' />
            ) : user ? (
              <div className='flex items-center gap-4'>
                 <div className="flex items-center gap-2">
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`} alt={user.name || ''}/>
                     <AvatarFallback>
                        <UserIcon />
                     </AvatarFallback>
                   </Avatar>
                   <span className="hidden text-sm sm:inline">{user.name || user.email}</span>
                 </div>
                <Button variant="secondary" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <Button onClick={() => setIsLoginOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Login
              </Button>
            )}
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="sr-only">
                  <SheetTitle>Mobile Menu</SheetTitle>
                  <SheetDescription>
                    Main navigation links for Campus Jive.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-6">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mr-6 flex items-center gap-2">
                        <Ticket className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">Campus Jive</span>
                    </Link>
                    <nav className="flex flex-col items-start gap-6 text-lg font-medium">
                        {navLinks.map((link) => (
                        <NavLink key={link.href} {...link} />
                        ))}
                        {user?.role === 'admin' && <NavLink href="/admin" label="Admin" />}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
