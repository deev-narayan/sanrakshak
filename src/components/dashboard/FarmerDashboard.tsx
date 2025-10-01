'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, User, UserPlus } from 'lucide-react';
import { useDashboard } from '@/context/DashboardProvider';
import { useEffect, useState } from 'react';
import type { Farmer } from '@/lib/schemas';

export default function FarmerDashboard() {
    const { farmers, isLoading } = useDashboard();

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <User className="text-primary"/>
                    Farmer Management
                </CardTitle>
                <CardDescription>Oversee registered farmers and their activities.</CardDescription>
            </div>
            <Link href="/farmers/register" passHref>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
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
                    {isLoading ? (
                         <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">Loading farmers...</TableCell>
                        </TableRow>
                    ) : farmers.length > 0 ? farmers.map(farmer => (
                        <TableRow key={farmer.id}>
                            <TableCell className="font-medium">{farmer.id}</TableCell>
                            <TableCell>{farmer.name}</TableCell>
                            <TableCell>{farmer.village}</TableCell>
                            <TableCell>{new Date(farmer.registeredDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Link href={`/farmers/${farmer.id}`} passHref>
                                    <Button variant="outline" size="sm">View Profile</Button>
                                </Link>
                                <Link href={`/farmers/${farmer.id}/edit`} passHref>
                                    <Button variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">No farmers found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
