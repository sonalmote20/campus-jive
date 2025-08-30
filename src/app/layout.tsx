import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/app-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import VideoBackground from '@/components/video-background';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Campus Jive',
  description: 'Your central hub for campus events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <VideoBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
