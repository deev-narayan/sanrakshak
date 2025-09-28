'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, User } from 'lucide-react';
import { useDashboard } from '@/context/DashboardProvider';

// Mock data for farmers, this would come from your DB
const farmers = [
    { id: 'FARM001', name: 'Ramesh Kumar', village: 'Bakshi Ka Talab', registeredDate: '2023-01-15' },
    { id: 'FARM002', name: 'Sita Devi', village: 'Gosainganj', registeredDate: '2023-02-20' },
    { id: 'FARM003', name: 'Amit Singh', village: 'Malihabad', registeredDate: '2023-03-10' },
];

export default function FarmerDashboard() {
    const { batches } = useDashboard();

    // In a real app, you would fetch farmers from your database.
    // We are using mock data here.

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <User className="text-primary"/>
                    Farmer Management
                </CardTitle>
                <CardDescription>Oversee registered farmers and their activities.</CardDescription>
            </div>
            <Link href="/farmers/register" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Farmer
                </Button>
            </Link>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Farmer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Village/District</TableHead>
                        <TableHead>Registered Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {farmers.length > 0 ? farmers.map(farmer => (
                        <TableRow key={farmer.id}>
                            <TableCell className="font-medium">{farmer.id}</TableCell>
                            <TableCell>{farmer.name}</TableCell>
                            <TableCell>{farmer.village}</TableCell>
                            <TableCell>{new Date(farmer.registeredDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/farmers/${farmer.id}`} passHref>
                                    <Button variant="outline" size="sm">View Profile</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No farmers found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
