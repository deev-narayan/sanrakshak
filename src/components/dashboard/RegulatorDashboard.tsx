'use client';
import { useDashboard } from '@/context/DashboardProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import type { Batch } from '@/lib/schemas';
import BatchTimeline from './BatchTimeline';
import { Shield, Eye } from 'lucide-react';

export default function RegulatorDashboard() {
  const { batches, isLoading } = useDashboard();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-primary"/>
            Regulator Dashboard
          </CardTitle>
          <CardDescription>Read-only overview of all batches for compliance and auditing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Finalized Date</TableHead>
                <TableHead className="text-right">Audit Trail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading batches...</TableCell></TableRow>
              ) : batches.length > 0 ? (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.id}</TableCell>
                    <TableCell>{batch.collectionEvents[0]?.species || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={batch.status === 'REJECTED' ? 'destructive' : 'secondary'}>{batch.status.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell>{batch.finalizedTimestamp ? new Date(batch.finalizedTimestamp).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(batch)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No batches found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Audit Trail: {selectedBatch?.id}</DialogTitle>
            <DialogDescription>
              Complete, end-to-end history for batch {selectedBatch?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-4 -mr-4">
            {selectedBatch && <BatchTimeline batch={selectedBatch} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
