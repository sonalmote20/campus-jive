import type { Category, Event, Photo } from './types';

export const initialCategories: Category[] = [
  { id: '1', name: 'Sports' },
  { id: '2', name: 'Music' },
  { id: '3', name: 'Tech' },
  { id: '4', name: 'Arts' },
];

export const initialEvents: Event[] = [
  {
    id: '1',
    name: 'Annual Tech Fest',
    category: 'Tech',
    description: 'A showcase of the latest in campus tech and innovation. Join us for workshops, competitions, and guest lectures.',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: '2',
    name: 'Inter-College Cricket Tournament',
    category: 'Sports',
    description: 'A thrilling tournament between the best cricket teams. Come and cheer for your college!',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: '3',
    name: 'Art & Culture Gala',
    category: 'Arts',
    description: 'Celebrating student talent in art, dance, and music. An evening of spectacular performances.',
    image: 'https://picsum.photos/600/400?random=3',
  },
    {
    id: '4',
    name: 'Campus Band Night',
    category: 'Music',
    description: 'Rock out with the best student bands on campus. A night of great music and high energy.',
    image: 'https://picsum.photos/600/400?random=4',
  },
];

export const initialPhotos: Photo[] = [
    { id: '1', src: 'https://picsum.photos/600/400?random=11', alt: 'Event photo 1' },
    { id: '2', src: 'https://picsum.photos/600/400?random=12', alt: 'Event photo 2' },
    { id: '3', src: 'https://picsum.photos/600/400?random=13', alt: 'Event photo 3' },
    { id: '4', src: 'https://picsum.photos/600/400?random=14', alt: 'Event photo 4' },
    { id: '5', src: 'https://picsum.photos/600/400?random=15', alt: 'Event photo 5' },
    { id: '6', src: 'https://picsum.photos/600/400?random=16', alt: 'Event photo 6' },
];

export const initialStudents = []; // This is no longer used
