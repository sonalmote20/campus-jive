'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAppContext();
  const { toast } = useToast();
  
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [showStudentPin, setShowStudentPin] = useState(false);
  
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  
  const [activeTab, setActiveTab] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentLogin = async () => {
    setIsLoading(true);
    try {
      await login('student', { email: studentEmail, pin: studentPin });
      toast({
        title: 'Login Successful',
        description: 'Welcome!',
      });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
      });
      console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      await login('admin', { user: adminUser, pass: adminPass });
      toast({
        title: 'Login Successful',
        description: 'Welcome, Admin!',
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid admin username or password.',
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const resetForm = () => {
      setAdminUser('');
      setAdminPass('');
      setStudentEmail('');
      setStudentPin('');
      setShowAdminPass(false);
      setShowStudentPin(false);
  };
  
  const handleDialogStateChange = (isOpen: boolean) => {
    if (!isOpen) {
        resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogStateChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary text-center text-2xl">Campus Jive Login</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(tab) => { resetForm(); setActiveTab(tab); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <div className="space-y-4 py-4">
              <p className="text-center text-sm text-muted-foreground">Login with your email and PIN.</p>
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <Input id="student-email" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="e.g., you@example.com" />
              </div>
              <div className="relative space-y-2">
                <Label htmlFor="student-pin">Security PIN</Label>
                <Input id="student-pin" type={showStudentPin ? 'text' : 'password'} value={studentPin} onChange={(e) => setStudentPin(e.target.value)} placeholder="Enter your PIN" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowStudentPin(!showStudentPin)}>
                    {showStudentPin ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <Button type="button" className="w-full !mt-6" onClick={handleStudentLogin} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Lock />}
                Login as Student
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="admin">
             <div className="space-y-4 py-4">
                <p className="text-center text-sm text-muted-foreground">Enter admin credentials.</p>
              <div className="space-y-2">
                <Label htmlFor="admin-user">Username</Label>
                <Input id="admin-user" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="Enter username" />
              </div>
              <div className="relative space-y-2">
                <Label htmlFor="admin-pass">Password</Label>
                <Input id="admin-pass" type={showAdminPass ? 'text' : 'password'} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Enter password" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowAdminPass(!showAdminPass)}>
                    {showAdminPass ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <Button type="button" className="w-full !mt-6" onClick={handleAdminLogin} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Lock />}
                Login as Admin
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
