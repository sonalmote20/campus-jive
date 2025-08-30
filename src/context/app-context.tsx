
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Event, Category, Booking, User, Photo } from '@/lib/types';
import { initialEvents, initialCategories, initialPhotos } from '@/lib/data';

const USER_STORAGE_KEY = 'campus-jive-user';
const STUDENT_PIN_STORAGE_KEY = 'campus-jive-student-pin';
const EVENTS_STORAGE_KEY = 'campus-jive-events';
const CATEGORIES_STORAGE_KEY = 'campus-jive-categories';
const BOOKINGS_STORAGE_KEY = 'campus-jive-bookings';
const PHOTOS_STORAGE_KEY = 'campus-jive-photos';

const DEFAULT_PIN = 'jive@123';

interface AppContextType {
  user: User | null;
  login: (method: 'student' | 'admin', credentials: {email?: string, pin?: string, user?: string, pass?: string}) => Promise<void>;
  logout: () => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'image'>) => void;
  deleteEvent: (eventId: string) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (categoryId: string) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => Booking;
  updateBookingStatus: (bookingId: string, status: 'approved' | 'rejected') => void;
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  deletePhoto: (photoId: string) => void;
  updateBackgroundVideo: (url: string) => void;
  loading: boolean;
  studentPin: string;
  updateStudentPin: (newPin: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [studentPin, setStudentPin] = useState<string>(DEFAULT_PIN);
  const [loading, setLoading] = useState(true);

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    try {
      // User
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Student PIN
      const savedPin = localStorage.getItem(STUDENT_PIN_STORAGE_KEY);
      setStudentPin(savedPin || DEFAULT_PIN);

      // Events
      const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      const parsedEvents = savedEvents ? JSON.parse(savedEvents) : null;
      if (parsedEvents && parsedEvents.length > 0) {
        setEvents(parsedEvents);
      } else {
        setEvents(initialEvents);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
      }

      // Categories
      const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const parsedCategories = savedCategories ? JSON.parse(savedCategories) : null;
      if (parsedCategories && parsedCategories.length > 0) {
        setCategories(parsedCategories);
      } else {
        setCategories(initialCategories);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
      }

      // Photos
      const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
      const parsedPhotos = savedPhotos ? JSON.parse(savedPhotos) : null;
      if (parsedPhotos && parsedPhotos.length > 0) {
        setPhotos(parsedPhotos);
      } else {
        setPhotos(initialPhotos);
        localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(initialPhotos));
      }

      // Bookings
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      // Fallback to initial data if localStorage fails
      setEvents(initialEvents);
      setCategories(initialCategories);
      setPhotos(initialPhotos);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (method: 'student' | 'admin', credentials: {email?: string, pin?: string, user?: string, pass?: string}) => {
    let loggedInUser: User | null = null;
    if (method === 'student' && credentials.email && credentials.pin) {
        if (credentials.pin === studentPin) {
            loggedInUser = {
                uid: credentials.email,
                email: credentials.email,
                name: 'Student', // Default name, can be changed on first booking
                role: 'student'
            };
        } else {
             throw new Error('Invalid security PIN.');
        }

    } else if (method === 'admin' && credentials.user && credentials.pass) {
        if (credentials.user === 'campusjive' && credentials.pass === 'jive@123') {
            loggedInUser = {
                uid: 'admin-user',
                email: 'admin@campusjive.edu',
                name: 'Admin',
                role: 'admin',
            };
        } else {
            throw new Error('Invalid admin credentials');
        }
    } else {
        throw new Error('Invalid login request.');
    }

    if (loggedInUser) {
        setUser(loggedInUser);
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
        } catch (error) {
            console.error("Failed to save user to localStorage", error);
        }
    }
  };

  const logout = () => {
      setUser(null);
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to remove user from localStorage", error);
      }
  };
  
  const updateStudentPin = (newPin: string) => {
    setStudentPin(newPin);
    try {
        localStorage.setItem(STUDENT_PIN_STORAGE_KEY, newPin);
    } catch(e) {
        console.error("Failed to save student PIN to localStorage", e);
    }
  };

  const addEvent = (event: Omit<Event, 'id' | 'image'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      image: `https://picsum.photos/600/400?random=${crypto.randomUUID()}`,
    };
    setEvents((prev) => {
        const updated = [...prev, newEvent];
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => {
        const updated = prev.filter((event) => event.id !== eventId);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
    setBookings((prev) => {
        const updated = prev.filter((booking) => booking.eventId !== eventId);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...category, id: crypto.randomUUID() };
    setCategories((prev) => {
        const updated = [...prev, newCategory];
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => {
        const updated = prev.filter((cat) => cat.id !== categoryId);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'status'>): Booking => {
    const newBooking: Booking = { ...booking, id: crypto.randomUUID(), status: 'pending' };
    setBookings((prev) => {
        const updated = [...prev, newBooking];
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
    
    if (user && user.email?.toLowerCase() === booking.custEmail.toLowerCase()) {
      const updatedUser = { ...user, name: booking.custName };
      setUser(updatedUser);
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update user in localStorage", error);
      }
    }
    
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: 'approved' | 'rejected') => {
    setBookings(prev => {
        const updated = prev.map(b => b.id === bookingId ? { ...b, status } : b);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };
  
  const addPhoto = (photo: Omit<Photo, 'id'>) => {
    const newPhoto: Photo = { ...photo, id: crypto.randomUUID() };
    setPhotos(prev => {
        const updated = [newPhoto, ...prev];
        localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => {
        const updated = prev.filter(p => p.id !== photoId);
        localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const updateBackgroundVideo = (url: string) => {
    try {
        // Do not save the video URL to localStorage to avoid quota errors.
        // This change will only persist for the current session.
        window.dispatchEvent(new CustomEvent('background-video-change', {
            detail: { url }
        }));
    } catch(e) {
        console.error('Failed to dispatch background video change event', e);
        // Inform the user if the event dispatch fails, which is highly unlikely.
        alert("Could not update the background video at this time.");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        events,
        addEvent,
        deleteEvent,
        categories,
        addCategory,
        deleteCategory,
        bookings,
        addBooking,
        updateBookingStatus,
        photos,
        addPhoto,
        deletePhoto,
        updateBackgroundVideo,
        loading,
        studentPin,
        updateStudentPin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
