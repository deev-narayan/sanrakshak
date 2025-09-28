import type { Batch } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, FlaskConical, Beaker, CircleDot, PackageCheck } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface BatchTimelineProps {
  batch: Batch;
}

const TimelineIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="absolute -left-5 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary">
    <Icon className="h-5 w-5 text-primary" />
  </div>
);

export default function BatchTimeline({ batch }: BatchTimelineProps) {
  const mapPlaceholder = PlaceHolderImages.find((p) => p.id === 'map-placeholder');

  return (
    <div className="space-y-8">
      {batch.collectionEvents.map((event, index) => (
        <div key={event.id} className="relative pl-8">
          <div className="absolute left-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
          <TimelineIcon icon={User} />
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Collection Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Species:</strong> {event.species}</p>
              <p><strong>Weight:</strong> {event.weightKg} kg</p>
              <p><strong>Date:</strong> {new Date(event.collectionDate).toLocaleString()}</p>
              <div className="pt-2">
                <h4 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-accent"/> Location</h4>
                <p className="pl-6">{event.location.name}</p>
                {mapPlaceholder && index === 0 && (
                  <div className="pl-6 mt-2">
                     <Image
                        src={mapPlaceholder.imageUrl}
                        data-ai-hint={mapPlaceholder.imageHint}
                        alt="Collection location"
                        width={400}
                        height={250}
                        className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {batch.qualityTests.map((test) => (
        <div key={test.id} className="relative pl-8">
          <div className="absolute left-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
          <TimelineIcon icon={FlaskConical} />
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Quality Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Sample ID:</strong> {test.sampleId}</p>
              <p><strong>Test Date:</strong> {new Date(test.testDate).toLocaleString()}</p>
              <div className="flex items-center gap-2 pt-2">
                <Beaker className="h-4 w-4 text-accent" />
                <strong>Results:</strong>
              </div>
              <ul className="list-disc pl-10">
                <li>Moisture Content: {test.moisturePct}%</li>
                <li>Pesticide Detected: <span className={test.pesticideDetected ? 'text-destructive font-bold' : 'text-primary font-bold'}>{test.pesticideDetected ? 'Yes' : 'No'}</span></li>
              </ul>
              <p className="pt-2"><strong>Report CID:</strong> {test.reportCid}</p>
            </CardContent>
          </Card>
        </div>
      ))}
      
      {batch.processingSteps.map((step) => (
        <div key={step.id} className="relative pl-8">
          <div className="absolute left-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
          <TimelineIcon icon={CircleDot} />
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Processing: {step.stepName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
               <p><strong>Details:</strong> {step.details}</p>
               <p><strong>Date:</strong> {new Date(step.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      ))}
      
       {batch.status === 'FINALIZED' && (
         <div className="relative pl-8">
          <TimelineIcon icon={PackageCheck} />
          <Card className="shadow-md border-primary border-2">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Batch Finalized</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
               <p><strong>Finalized On:</strong> {new Date(batch.finalizedTimestamp!).toLocaleString()}</p>
               <p>Product is now ready for market with verified provenance.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
