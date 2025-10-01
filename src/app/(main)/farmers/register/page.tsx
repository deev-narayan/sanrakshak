'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardProvider';

const registerFarmerSchema = z.object({
  id: z.string().min(3, 'Farmer ID is required').regex(/^[A-Z0-9]+$/, 'Farmer ID must be alphanumeric uppercase'),
  name: z.string().min(3, 'Full name is required'),
  village: z.string().min(1, 'Village/District is required'),
  contact: z.string().min(10, 'Contact number must be at least 10 digits'),
  geoFence: z.string().min(1, 'Geo-fence area is required'),
});

export default function RegisterFarmerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { refreshFarmers } = useDashboard();

  const form = useForm<z.infer<typeof registerFarmerSchema>>({
    resolver: zodResolver(registerFarmerSchema),
    defaultValues: {
      id: '',
      name: '',
      village: '',
      contact: '',
      geoFence: 'Lucknow District, UP, India',
    },
  });

  async function onSubmit(values: z.infer<typeof registerFarmerSchema>) {
    try {
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register farmer');
      }

      toast({
        title: 'Farmer Registered!',
        description: `Farmer ${result.name} has been successfully registered.`,
      });

      refreshFarmers();
      router.push('/');

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Registration Error',
            description: error.message,
        });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="text-primary" /> Register New Farmer
          </CardTitle>
          <CardDescription>Add a new farmer to the cooperative system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farmer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., FARM004" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Suresh Mehta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Village/District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mohanlalganj" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="geoFence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Geo-fenced Area</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lucknow District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                 <Link href="/" passHref>
                    <Button variant="outline" type="button">Cancel</Button>
                 </Link>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Registering...' : 'Register Farmer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
