'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { Batch } from '@/lib/schemas';
import BatchTimeline from '@/components/dashboard/BatchTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2, ServerCrash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function VerifyContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batchId');
  const [batch, setBatch] = useState<Batch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (batchId) {
      const fetchBatch = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/batch/${batchId}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Batch not found');
          }
          const data = await res.json();
          setBatch(data);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBatch();
    } else {
      setError('No Batch ID provided.');
      setIsLoading(false);
    }
  }, [batchId]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-8">
            <Bot className="w-12 h-12 text-primary" />
            <div>
                 <h1 className="text-4xl font-bold text-gray-800">Sanrakshak</h1>
                 <p className="text-lg text-muted-foreground">Botanical Traceability Report</p>
            </div>
       </div>

      {isLoading && <TimelineSkeleton />}

      {error && !isLoading && (
         <Alert variant="destructive">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && batch && (
        <Card className="shadow-2xl bg-white/50">
            <CardHeader>
                <CardTitle className="text-2xl">Provenance for Batch: <span className="text-primary font-mono">{batch.id}</span></CardTitle>
            </CardHeader>
            <CardContent>
                <BatchTimeline batch={batch} />
            </CardContent>
        </Card>
      )}
    </div>
  );
}

const TimelineSkeleton = () => (
    <div className="space-y-8">
        {[1, 2, 3].map(i => (
            <div key={i} className="relative pl-8">
                <Skeleton className="absolute -left-5 top-1 h-10 w-10 rounded-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        ))}
    </div>
)


export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <VerifyContent />
        </Suspense>
    )
}
