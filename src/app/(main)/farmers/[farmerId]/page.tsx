'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, MapPin, Phone } from 'lucide-react';
import { useDashboard } from '@/context/DashboardProvider';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Batch, Farmer } from '@/lib/schemas';
import { Skeleton } from '@/components/ui/skeleton';


export default function FarmerProfilePage() {
  const { farmerId } = useParams<{ farmerId: string }>();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farmerBatches, setFarmerBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
        if (!farmerId) return;
        setIsLoading(true);
        try {
            const [farmerRes, batchesRes] = await Promise.all([
                fetch(`/api/farmers/${farmerId}`),
                fetch(`/api/farmers/${farmerId}/batches`)
            ]);

            if (!farmerRes.ok) throw new Error('Farmer not found');
            if (!batchesRes.ok) throw new Error('Could not fetch batches');

            const farmerData = await farmerRes.json();
            const batchesData = await batchesRes.json();

            setFarmer(farmerData);
            setFarmerBatches(batchesData);

        } catch (error) {
            console.error("Failed to fetch farmer profile:", error);
            setFarmer(null);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [farmerId]);
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
  }

  if (!farmer) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Farmer not found</h1>
            <Link href="/" passHref>
                <Button variant="link">Go Back to Farmer List</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="space-y-8">
        <Link href="/" passHref>
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Farmer List
            </Button>
        </Link>
        
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="flex items-center gap-3">
                        <User className="text-primary w-8 h-8" />
                        {farmer.name}
                    </CardTitle>
                    <CardDescription>Farmer Profile - {farmer.id}</CardDescription>
                </div>
                <Link href={`/farmers/${farmer.id}/edit`} passHref>
                    <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Farmer Details
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <span className="font-semibold">Contact:</span> {farmer.contact}
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <span className="font-semibold">Village:</span> {farmer.village}
                    </div>
                </div>
                 <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                     <div>
                        <span className="font-semibold">Geo-fence:</span> {farmer.geoFence}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Collection History</CardTitle>
                <CardDescription>All batches submitted by {farmer.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Species</TableHead>
                            <TableHead>Weight (kg)</TableHead>
                            <TableHead>Collection Date</TableHead>
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
                                <TableCell colSpan={5} className="text-center h-24">No collections found for this farmer.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
