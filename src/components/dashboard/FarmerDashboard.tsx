'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/context/DashboardProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const collectionSchema = z.object({
  species: z.string().min(1, 'Species is required'),
  weightKg: z.coerce.number().min(0.1, 'Weight must be at least 0.1 kg'),
});

export default function FarmerDashboard() {
  const { toast } = useToast();
  const { refreshBatches, batches } = useDashboard();
  const mapPlaceholder = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  const form = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      species: '',
      weightKg: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof collectionSchema>) {
    try {
      // Simulate auto-detected location
      const location = {
        name: "Lucknow, India",
        coordinates: [26.85, 80.95] as [number, number]
      };

      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, location, photoCid: 'simulated_photo_cid', farmerSignature: 'simulated_farmer_sig' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit collection');
      }

      toast({
        title: 'Collection Submitted!',
        description: `New Batch ID: ${result.id}`,
      });
      form.reset();
      refreshBatches();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: error.message,
      });
    }
  }

  const farmerBatches = batches.filter(b => b.collectionEvents.length > 0);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="text-primary" /> New Collection
            </CardTitle>
            <CardDescription>Enter details for a new botanical collection.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ashwagandha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 50.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <Button variant="outline" className="w-full justify-start text-muted-foreground" type="button">
                        <Camera className="mr-2 h-4 w-4" />
                        Upload Photo (Simulated)
                    </Button>
                </FormItem>

                 <FormItem>
                    <FormLabel>Location</FormLabel>
                     <div className="rounded-md border p-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Auto-detected: Lucknow, India</span>
                        </div>
                        {mapPlaceholder && <Image src={mapPlaceholder.imageUrl} data-ai-hint={mapPlaceholder.imageHint} alt="Map placeholder" width={600} height={400} className="rounded-md aspect-video object-cover" />}
                     </div>
                </FormItem>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Submit Collection'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>My Collections</CardTitle>
                <CardDescription>History of your submitted batches.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Species</TableHead>
                        <TableHead>Weight (kg)</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {farmerBatches.length > 0 ? farmerBatches.map(batch => (
                            <TableRow key={batch.id}>
                                <TableCell className="font-medium">{batch.id}</TableCell>
                                <TableCell>{batch.collectionEvents[0].species}</TableCell>
                                <TableCell>{batch.collectionEvents[0].weightKg}</TableCell>
                                <TableCell>{new Date(batch.collectionEvents[0].collectionDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={batch.status === 'REJECTED' ? 'destructive' : 'secondary'}>{batch.status.replace(/_/g, ' ')}</Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No collections found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
