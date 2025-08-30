'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

const DEFAULT_BACKGROUND_VIDEO = '/neon2.mp4';

const VideoBackground = () => {
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_BACKGROUND_VIDEO);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleVideoChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.url) {
        setVideoUrl(customEvent.detail.url);
      }
    };
    
    // Listen for custom event to change video for the session
    window.addEventListener('background-video-change', handleVideoChange);
    setIsLoading(false);

    return () => {
      window.removeEventListener('background-video-change', handleVideoChange);
    };
  }, []);


  if (isLoading) {
     return <Skeleton className="fixed inset-0 z-[-1] w-full h-full" />;
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <video
        key={videoUrl} // Re-renders the video element when the source changes
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover brightness-50"
      >
        <source
          src={videoUrl}
          type={videoUrl.startsWith('data:video') ? 'video/mp4' : undefined}
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
       <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
    </div>
  );
};

export default VideoBackground;
