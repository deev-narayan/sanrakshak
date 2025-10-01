export type UserRole = 'Farmer' | 'Lab' | 'Manufacturer' | 'Regulator';

export type BatchStatus = 'PENDING_TESTING' | 'TESTING_COMPLETE' | 'PROCESSING' | 'FINALIZED' | 'REJECTED';

export interface Farmer {
  id: string;
  name: string;
  village: string;
  contact: string;
  geoFence: string;
  registeredDate: string;
}

export interface CollectionEvent {
  id: string;
  batchId: string;
  farmerId: string;
  species: string;
  weightKg: number;
  photoCid: string; // Simulated IPFS hash for photo
  location: {
    name: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  collectionDate: string;
  farmerSignature: string;
}

export interface QualityTest {
  id: string;
  sampleId: string;
  batchId: string;
  moisturePct: number;
  pesticideDetected: boolean;
  reportCid: string; // IPFS hash for full report PDF
  testDate: string;
  labSignature: string;
}

export interface ProcessingStep {
  id: string;
  batchId: string;
  stepName: string;
  details: string;
  timestamp: string;
  manufacturerSignature: string;
}

export interface Batch {
  id: string;
  status: BatchStatus;
  collectionEvents: CollectionEvent[];
  qualityTests: QualityTest[];
  processingSteps: ProcessingStep[];
  finalizedTimestamp?: string;
  qrCodeUrl?: string;
}
