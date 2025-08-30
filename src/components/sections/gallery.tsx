'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

export default function Gallery() {
  const { photos, addPhoto, deletePhoto, user } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            addPhoto({ src: e.target.result as string, alt: file.name });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      {user?.role === 'admin' && (
        <div className="flex justify-center mb-8">
          <Button size="lg" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-5 w-5" />
            Upload Photos
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </div>
      )}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="event gallery"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                 <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="outline" size="icon">
                            <Eye className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0">
                         <div className="relative aspect-video">
                            <Image src={photo.src} alt={photo.alt} fill className="object-contain rounded-lg"/>
                         </div>
                    </DialogContent>
                </Dialog>

                {user?.role === 'admin' && (
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the photo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePhoto(photo.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border">
          <p className="text-muted-foreground">The gallery is empty. Admin can upload photos.</p>
        </div>
      )}
    </div>
  );
}
