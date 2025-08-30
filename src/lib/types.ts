export interface Category {
  id: string;
  name: string;
}

export interface Event {
  id:string;
  name: string;
  category: string;
  description: string;
  image: string;
}

export interface Booking {
  id: string;
  custName: string;
  custEmail: string;
  eventId: string;
  eventName: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
}

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'student' | 'admin';
}
