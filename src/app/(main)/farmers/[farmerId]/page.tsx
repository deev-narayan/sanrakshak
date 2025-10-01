'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, MapPin, Phone } from 'lucide-react';
import { useDashboard } from '@/context/DashboardProvider';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Mock data, in a real app you'd fetch this based on farmerId
const farmers = [
    { id: 'FARM001', name: 'Ramesh Kumar', village: 'Bakshi Ka Talab', contact: '9876543210', geoFence: 'Bakshi Ka Talab, Lucknow' },
    { id: 'FARM002', name: 'Sita Devi', village: 'Gosainganj', contact: '9876543211', geoFence: 'Gosainganj, Lucknow' },
    { id: 'FARM003', name: 'Amit Singh', village: 'Malihabad', contact: '9876543212', geoFence: 'Malihabad, Lucknow' },
];

export default function FarmerProfilePage() {
  const { farmerId } = useParams<{ farmerId: string }>();
  const { batches, isLoading } = useDashboard();
  
  // Find the farmer from mock data
  const farmer = farmers.find(f => f.id === farmerId);

  // Filter batches submitted by this farmer. 
  // NOTE: This is a simulation. In a real app, the collectionEvent would have a farmerId.
  // We'll simulate this by assigning some batches to this farmer for demonstration.
  const farmerBatches = batches.filter(b => {
    if (farmerId === 'FARM001') return b.id.includes('ASH') || b.id.includes('TUL');
    if (farmerId === 'FARM002') return b.id.includes('NEM');
    return false;
  });

  if (!farmer) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Farmer not found</h1>
            <Link href="/" passHref>
                <Button variant="link">Go Back</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="space-y-8">
        <Link href="/" passHref>
            <Button variant="outline" className="mb-4">
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">Loading collections...</TableCell>
                            </TableRow>
                        ) : farmerBatches.length > 0 ? farmerBatches.map(batch => (
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
