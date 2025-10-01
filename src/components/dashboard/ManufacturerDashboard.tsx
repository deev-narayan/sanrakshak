'use client';
import { useDashboard } from '@/context/DashboardProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import type { Batch } from '@/lib/schemas';
import BatchTimeline from './BatchTimeline';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, CircleDot, Hourglass, Package, PackageCheck, XCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import QRCode from 'qrcode';


const statusIcons: { [key: string]: React.ElementType } = {
  PENDING_TESTING: Hourglass,
  TESTING_COMPLETE: CheckCircle,
  PROCESSING: CircleDot,
  FINALIZED: PackageCheck,
  REJECTED: XCircle,
};

const processStepSchema = z.object({
  stepName: z.string().min(1, "Step name is required"),
  details: z.string().min(1, "Details are required"),
});

const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

const generateBatchXml = (batch: Batch): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<Bundle xmlns="http://hl7.org/fhir">\n';
    xml += `  <id value="${batch.id}" />\n`;
    xml += `  <type value="collection" />\n`;

    // Provenance for the entire batch
    xml += '  <entry>\n';
    xml += '    <resource>\n';
    xml += '      <Provenance>\n';
    xml += `        <id value="${batch.id}-provenance" />\n`;
    xml += `        <target>\n          <reference value="Batch/${batch.id}" />\n        </target>\n`;
    xml += `        <recorded value="${batch.finalizedTimestamp || new Date().toISOString()}" />\n`;
    
    // Collection Event
    batch.collectionEvents.forEach(event => {
        xml += '        <entity>\n';
        xml += '          <role value="source" />\n';
        xml += '          <what>\n';
        xml += `            <display value="Collection Event: ${event.id}" />\n`;
        xml += '          </what>\n';
        xml += '        </entity>\n';
    });

    // Quality Tests
    batch.qualityTests.forEach(test => {
        xml += '        <entity>\n';
        xml += '          <role value="source" />\n';
        xml += '          <what>\n';
        xml += `            <display value="Quality Test: ${test.id}" />\n`;
        xml += '          </what>\n';
        xml += '        </entity>\n';
    });
     
    // Processing Steps
    batch.processingSteps.forEach(step => {
        xml += '        <entity>\n';
        xml += '          <role value="source" />\n';
        xml += '          <what>\n';
        xml += `            <display value="Processing Step: ${step.stepName}" />\n`;
        xml += '          </what>\n';
        xml += '        </entity>\n';
    });
    
    xml += '      </Provenance>\n';
    xml += '    </resource>\n';
    xml += '  </entry>\n';

    // Collection Event Details
    batch.collectionEvents.forEach(event => {
        xml += '  <entry>\n';
        xml += '    <resource>\n';
        xml += `      <Observation>\n`;
        xml += `        <id value="${event.id}" />\n`;
        xml += `        <status value="final" />\n`;
        xml += `        <code>\n          <text value="Collection Details" />\n        </code>\n`;
        xml += `        <component>\n          <code><text value="Species" /></code>\n          <valueString value="${escapeXml(event.species)}" />\n        </component>\n`;
        xml += `        <component>\n          <code><text value="WeightKg" /></code>\n          <valueQuantity>\n            <value value="${event.weightKg}" />\n            <unit value="kg" />\n          </valueQuantity>\n        </component>\n`;
        xml += `        <component>\n          <code><text value="Location" /></code>\n          <valueString value="${escapeXml(event.location.name)}" />\n        </component>\n`;
        xml += `        <component>\n          <code><text value="Farmer" /></code>\n          <valueString value="${escapeXml(event.farmerId)}" />\n        </component>\n`;
        xml += `        <effectiveDateTime value="${event.collectionDate}" />\n`;
        xml += `      </Observation>\n`;
        xml += '    </resource>\n';
        xml += '  </entry>\n';
    });
    
    // ... add similar entries for QualityTest and ProcessingStep if needed ...

    xml += '</Bundle>';
    return xml;
};


export default function ManufacturerDashboard() {
  const { batches, isLoading, refreshBatches } = useDashboard();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [generatedQrCode, setGeneratedQrCode] = useState<string>('');
  const { toast } = useToast();


  const form = useForm<z.infer<typeof processStepSchema>>({
    resolver: zodResolver(processStepSchema),
    defaultValues: {
      stepName: '',
      details: '',
    },
  });

  const handleViewDetails = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDetailsOpen(true);
  };

  const handleFinalizeBatch = async (batchId: string) => {
    try {
      const response = await fetch(`/api/finalize-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      toast({ title: 'Batch Finalized!', description: `Batch ${batchId} is now finalized.` });
      refreshBatches();

      const xmlData = generateBatchXml(result);
      const qrDataUrl = await QRCode.toDataURL(xmlData, { errorCorrectionLevel: 'L', width: 256 });
      setGeneratedQrCode(qrDataUrl);
      
      setSelectedBatch(result); 
      setIsDetailsOpen(false);
      setIsQrOpen(true);

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleDownloadQrCode = () => {
    if (!selectedBatch || !generatedQrCode) return;

    const a = document.createElement('a');
    a.href = generatedQrCode;
    a.download = `qr-batch-${selectedBatch.id}.png`;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
  };

  async function onAddProcessingStep(values: z.infer<typeof processStepSchema>) {
    if (!selectedBatch) return;

    try {
        const response = await fetch('/api/processing-step', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, batchId: selectedBatch.id, manufacturerSignature: 'mfg_sig_sim' }),
        });
        const result = await response.json();
        if(!response.ok) throw new Error(result.error);

        toast({ title: "Processing Step Added", description: `Added '${values.stepName}' to batch ${selectedBatch.id}` });
        refreshBatches();
        setSelectedBatch(result);
        form.reset();
        setIsProcessingOpen(false);

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  }


  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="text-primary"/> Manufacturing Dashboard</CardTitle>
          <CardDescription>Manage and view all processed batches.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collection Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading batches...</TableCell></TableRow>
              ) : batches.length > 0 ? (
                batches.map((batch) => {
                  const Icon = statusIcons[batch.status] || CircleDot;
                  return (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.collectionEvents[0]?.species || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={batch.status === 'REJECTED' ? 'destructive' : 'secondary'} className="gap-1.5 pl-1.5">
                            <Icon className="h-3.5 w-3.5" />
                           {batch.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(batch.collectionEvents[0]?.collectionDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(batch)}>View Details</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No batches found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Batch Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Batch Details: {selectedBatch?.id}</DialogTitle>
            <DialogDescription>Full provenance and history for this batch.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-4 -mr-4">
            {selectedBatch && <BatchTimeline batch={selectedBatch} />}
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            <Button variant="outline" onClick={() => { form.reset(); setIsProcessingOpen(true); }} disabled={selectedBatch?.status === 'FINALIZED'}>Add Processing Step</Button>
            <Button onClick={() => handleFinalizeBatch(selectedBatch!.id)} disabled={selectedBatch?.status === 'FINALIZED' || selectedBatch?.qualityTests.length === 0}>
                Finalize & Generate QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Processing Step Dialog */}
      <Dialog open={isProcessingOpen} onOpenChange={setIsProcessingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Processing Step</DialogTitle>
            <DialogDescription>Log a new step for batch {selectedBatch?.id}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddProcessingStep)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="stepName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Drying, Grinding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the process..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <Button variant="ghost" type="button" onClick={() => setIsProcessingOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Adding..." : "Add Step"}
                    </Button>
                </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* QR Code Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Batch Finalized! Scan QR for Provenance</DialogTitle>
                  <DialogDescription>
                      The QR code for batch <span className="font-bold">{selectedBatch?.id}</span> contains the full XML data.
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center items-center p-4">
                {generatedQrCode && (
                  <Image src={generatedQrCode} alt="Generated QR Code" width={256} height={256} className="rounded-lg" />
                )}
              </div>
              <DialogFooter className='gap-2'>
                <Button variant="outline" onClick={handleDownloadQrCode}>Download QR Code</Button>
                <Button onClick={() => setIsQrOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
