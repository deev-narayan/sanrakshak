import type { Batch, CollectionEvent, QualityTest, ProcessingStep, BatchStatus } from './schemas';

// In-memory store
const batches: Batch[] = [
  {
    id: 'B001-ASH',
    status: 'TESTING_COMPLETE',
    collectionEvents: [
      {
        id: 'C001',
        batchId: 'B001-ASH',
        species: 'Ashwagandha',
        weightKg: 50,
        photoCid: 'ipfs_photo_hash_1',
        location: { name: 'Lucknow, India', coordinates: [26.85, 80.95] },
        collectionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        farmerSignature: 'farmer_sig_01',
      },
    ],
    qualityTests: [
        {
            id: 'Q001',
            sampleId: 'S001-B001',
            batchId: 'B001-ASH',
            moisturePct: 12.5,
            pesticideDetected: false,
            reportCid: 'ipfs_report_hash_1',
            testDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            labSignature: 'lab_sig_01'
        }
    ],
    processingSteps: [],
  },
  {
    id: 'B002-TUL',
    status: 'PENDING_TESTING',
    collectionEvents: [
      {
        id: 'C002',
        batchId: 'B002-TUL',
        species: 'Tulsi',
        weightKg: 35,
        photoCid: 'ipfs_photo_hash_2',
        location: { name: 'Kanpur, India', coordinates: [26.4499, 80.3319] },
        collectionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        farmerSignature: 'farmer_sig_02',
      },
    ],
    qualityTests: [],
    processingSteps: [],
  },
    {
    id: 'B003-NEM',
    status: 'FINALIZED',
    collectionEvents: [
      {
        id: 'C003',
        batchId: 'B003-NEM',
        species: 'Neem',
        weightKg: 120,
        photoCid: 'ipfs_photo_hash_3',
        location: { name: 'Varanasi, India', coordinates: [25.3176, 82.9739] },
        collectionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        farmerSignature: 'farmer_sig_03',
      },
    ],
    qualityTests: [
        {
            id: 'Q002',
            sampleId: 'S002-B003',
            batchId: 'B003-NEM',
            moisturePct: 10.1,
            pesticideDetected: false,
            reportCid: 'ipfs_report_hash_2',
            testDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            labSignature: 'lab_sig_02'
        }
    ],
    processingSteps: [
        {
            id: 'P001',
            batchId: 'B003-NEM',
            stepName: 'Drying',
            details: 'Sun-dried for 48 hours.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            manufacturerSignature: 'mfg_sig_01'
        },
        {
            id: 'P002',
            batchId: 'B003-NEM',
            stepName: 'Packaging',
            details: 'Packaged in 5kg bags.',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            manufacturerSignature: 'mfg_sig_02'
        }
    ],
    finalizedTimestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    qrCodeUrl: `/verify?batchId=B003-NEM`
  }
];

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}${Math.random().toString(36).substr(2, 9)}`;

export const db = {
  getBatches: (): Batch[] => {
    return batches;
  },

  getBatchById: (id: string): Batch | undefined => {
    return batches.find(b => b.id === id);
  },

  addCollectionEvent: (eventData: Omit<CollectionEvent, 'id' | 'batchId'>): Batch => {
    const batchId = `B${String(batches.length + 1).padStart(3, '0')}-${eventData.species.slice(0,3).toUpperCase()}`;
    
    const newCollectionEvent: CollectionEvent = {
      ...eventData,
      id: generateId('C'),
      batchId,
    };
    
    const newBatch: Batch = {
      id: batchId,
      status: 'PENDING_TESTING',
      collectionEvents: [newCollectionEvent],
      qualityTests: [],
      processingSteps: [],
    };

    batches.unshift(newBatch);
    return newBatch;
  },

  addQualityTest: (testData: Omit<QualityTest, 'id'>): Batch | undefined => {
    const batch = batches.find(b => b.id === testData.batchId);
    if (!batch) throw new Error('Batch not found');

    const newTest: QualityTest = { ...testData, id: generateId('Q') };
    batch.qualityTests.push(newTest);
    batch.status = 'TESTING_COMPLETE';
    return batch;
  },
  
  addProcessingStep: (stepData: Omit<ProcessingStep, 'id'>): Batch | undefined => {
    const batch = batches.find(b => b.id === stepData.batchId);
    if (!batch) throw new Error('Batch not found');
    
    const newStep: ProcessingStep = { ...stepData, id: generateId('P') };
    batch.processingSteps.push(newStep);
    batch.status = 'PROCESSING';
    return batch;
  },

  finalizeBatch: (batchId: string): Batch | undefined => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');

    batch.status = 'FINALIZED';
    batch.finalizedTimestamp = new Date().toISOString();
    batch.qrCodeUrl = `/verify?batchId=${batchId}`;
    return batch;
  }
};
