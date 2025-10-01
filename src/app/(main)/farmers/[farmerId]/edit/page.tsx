'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Farmer } from '@/lib/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/context/DashboardProvider';


const editFarmerSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  village: z.string().min(1, 'Village/District is required'),
  contact: z.string().min(10, 'Contact number must be at least 10 digits'),
  geoFence: z.string().min(1, 'Geo-fence area is required'),
});

export default function EditFarmerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { farmerId } = useParams<{ farmerId: string }>();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshFarmers } = useDashboard();

  const form = useForm<z.infer<typeof editFarmerSchema>>({
    resolver: zodResolver(editFarmerSchema),
    defaultValues: {
      name: '',
      village: '',
      contact: '',
      geoFence: '',
    },
  });

  useEffect(() => {
    if (farmerId) {
        setIsLoading(true);
        fetch(`/api/farmers/${farmerId}`)
            .then(res => {
                if (!res.ok) throw new Error('Farmer not found');
                return res.json()
            })
            .then(data => {
                setFarmer(data);
                form.reset(data);
            })
            .catch(err => {
                console.error(err);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load farmer data.' });
            })
            .finally(() => setIsLoading(false));
    }
  }, [farmerId, form, toast]);


  async function onSubmit(values: z.infer<typeof editFarmerSchema>) {
    try {
        const response = await fetch(`/api/farmers/${farmerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        
        toast({
          title: 'Farmer Updated!',
          description: `${values.name}'s details have been updated.`,
        });

        refreshFarmers();
        router.push(`/farmers/${farmerId}`);
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Update Error',
            description: error.message,
        });
    }
  }

  if (isLoading) {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!farmer) {
    return <div className="max-w-2xl mx-auto">Farmer not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="text-primary" /> Edit Farmer: {farmer.name}
          </CardTitle>
          <CardDescription>Update the details for Farmer ID: {farmer.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                 <Link href={`/farmers/${farmerId}`} passHref>
                    <Button variant="outline" type="button">Cancel</Button>
                 </Link>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Updating...' : 'Update Farmer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
