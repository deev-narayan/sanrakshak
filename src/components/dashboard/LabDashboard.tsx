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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, FlaskConical } from 'lucide-react';
import { useState } from 'react';

const testSchema = z.object({
  batchId: z.string().min(1, 'Please select a batch'),
  moisturePct: z.coerce.number().min(0, 'Moisture % cannot be negative').max(100, 'Moisture % cannot exceed 100'),
  pesticideDetected: z.boolean(),
  reportCid: z.string().min(1, 'Report CID is required'),
});

export default function LabDashboard() {
  const { toast } = useToast();
  const { refreshBatches, batches, isLoading } = useDashboard();
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      batchId: '',
      moisturePct: 10,
      pesticideDetected: false,
      reportCid: 'Qm...',
    },
  });

  async function onSubmit(values: z.infer<typeof testSchema>) {
    try {
      const response = await fetch('/api/quality-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...values, 
            sampleId: `S-${values.batchId}-${Date.now()}`.slice(0, 15),
            testDate: new Date().toISOString(),
            labSignature: 'simulated_lab_sig'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit test report');
      }

      toast({
        title: 'Test Report Submitted!',
        description: `Batch ${result.id} status updated to ${result.status}.`,
      });
      form.reset();
      setSelectedBatch('');
      refreshBatches();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: error.message,
      });
    }
  }

  const pendingBatches = batches.filter(b => b.status === 'PENDING_TESTING');

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FlaskConical className="text-primary"/>
                Submit Test Report
            </CardTitle>
            <CardDescription>Enter quality analysis results for a batch.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="batchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch ID</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); setSelectedBatch(value);}} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a batch to test" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pendingBatches.map(b => (
                            <SelectItem key={b.id} value={b.id}>{b.id} ({b.collectionEvents[0].species})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="moisturePct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moisture (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 12.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pesticideDetected"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Pesticide Detected</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportCid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report CID (IPFS Hash)</FormLabel>
                      <FormControl>
                        <Input placeholder="IPFS hash of the full report" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                    <FormLabel>Lab Signature</FormLabel>
                    <Input placeholder="Your digital signature" defaultValue="lab_sig_..." disabled />
                </FormItem>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !selectedBatch}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Pending Tests</CardTitle>
                <CardDescription>Batches waiting for quality analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Species</TableHead>
                            <TableHead>Collection Date</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && pendingBatches.length > 0 ? pendingBatches.map(batch => (
                            <TableRow key={batch.id} className={selectedBatch === batch.id ? 'bg-primary/10' : ''}>
                                <TableCell className="font-medium">{batch.id}</TableCell>
                                <TableCell>{batch.collectionEvents[0].species}</TableCell>
                                <TableCell>{new Date(batch.collectionEvents[0].collectionDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => { form.setValue('batchId', batch.id); setSelectedBatch(batch.id)}}>
                                        Test
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">{isLoading ? "Loading..." : "No batches pending for testing."}</TableCell>
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
