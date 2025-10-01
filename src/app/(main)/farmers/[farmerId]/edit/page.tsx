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

// Mock data, in a real app you'd fetch this based on farmerId
const farmers = [
    { id: 'FARM001', name: 'Ramesh Kumar', village: 'Bakshi Ka Talab', contact: '9876543210', geoFence: 'Bakshi Ka Talab, Lucknow' },
    { id: 'FARM002', name: 'Sita Devi', village: 'Gosainganj', contact: '9876543211', geoFence: 'Gosainganj, Lucknow' },
    { id: 'FARM003', name: 'Amit Singh', village: 'Malihabad', contact: '9876543212', geoFence: 'Malihabad, Lucknow' },
];

const editFarmerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  village: z.string().min(1, 'Village/District is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  geoFence: z.string().min(1, 'Geo-fence area is required'),
});

export default function EditFarmerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { farmerId } = useParams<{ farmerId: string }>();

  const farmer = farmers.find(f => f.id === farmerId);

  const form = useForm<z.infer<typeof editFarmerSchema>>({
    resolver: zodResolver(editFarmerSchema),
    defaultValues: {
      fullName: farmer?.name || '',
      village: farmer?.village || '',
      contactNumber: farmer?.contact || '',
      geoFence: farmer?.geoFence || 'Lucknow District, UP, India',
    },
  });

  async function onSubmit(values: z.infer<typeof editFarmerSchema>) {
    // Here you would typically send the data to your API to update the farmer
    console.log('Updating farmer:', farmerId, values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Farmer Updated!',
      description: `${values.fullName}'s details have been updated.`,
    });

    // In a real app, you would handle the response and maybe redirect.
    router.push(`/farmers/${farmerId}`);
  }

  if (!farmer) {
    return <div>Farmer not found</div>;
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
                name="fullName"
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
                name="contactNumber"
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
