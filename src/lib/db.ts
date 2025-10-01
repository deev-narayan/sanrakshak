import type { Batch, CollectionEvent, QualityTest, ProcessingStep, Farmer } from './schemas';

// In-memory store
const farmers: Farmer[] = [
    { id: 'FARM001', name: 'Ramesh Kumar', village: 'Bakshi Ka Talab', contact: '9876543210', geoFence: 'Bakshi Ka Talab, Lucknow', registeredDate: '2023-01-15' },
    { id: 'FARM002', name: 'Sita Devi', village: 'Gosainganj', contact: '9876543211', geoFence: 'Gosainganj, Lucknow', registeredDate: '2023-02-20' },
    { id: 'FARM003', name: 'Amit Singh', village: 'Malihabad', contact: '9876543212', geoFence: 'Malihabad, Lucknow', registeredDate: '2023-03-10' },
];

const batches: Batch[] = [
  {
    id: 'B001-ASH',
    status: 'TESTING_COMPLETE',
    collectionEvents: [
      {
        id: 'C001',
        batchId: 'B001-ASH',
        farmerId: 'FARM001',
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
        farmerId: 'FARM001',
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
        farmerId: 'FARM002',
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
  },
  {
    id: 'B004-GIL',
    status: 'PENDING_TESTING',
    collectionEvents: [
      {
        id: 'C004',
        batchId: 'B004-GIL',
        farmerId: 'FARM003',
        species: 'Giloy',
        weightKg: 25,
        photoCid: 'ipfs_photo_hash_4',
        location: { name: 'Prayagraj, India', coordinates: [25.4358, 81.8463] },
        collectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        farmerSignature: 'farmer_sig_04',
      },
    ],
    qualityTests: [],
    processingSteps: [],
  },
  {
    id: 'B005-BRA',
    status: 'PENDING_TESTING',
    collectionEvents: [
      {
        id: 'C005',
        batchId: 'B005-BRA',
        farmerId: 'FARM002',
        species: 'Brahmi',
        weightKg: 42,
        photoCid: 'ipfs_photo_hash_5',
        location: { name: 'Ayodhya, India', coordinates: [26.7937, 82.1998] },
        collectionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        farmerSignature: 'farmer_sig_05',
      },
    ],
    qualityTests: [],
    processingSteps: [],
  }
];

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}${Math.random().toString(36).substr(2, 9)}`;

export const db = {
  // Farmer methods
  getFarmers: (): Farmer[] => {
    return farmers.sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime());
  },

  getFarmerById: (id: string): Farmer | undefined => {
    return farmers.find(f => f.id === id);
  },

  addFarmer: (farmerData: Omit<Farmer, 'registeredDate'>): Farmer => {
    if (farmers.some(f => f.id === farmerData.id)) {
        throw new Error('Farmer with this ID already exists.');
    }
    const newFarmer: Farmer = {
      ...farmerData,
      registeredDate: new Date().toISOString(),
    };
    farmers.unshift(newFarmer);
    return newFarmer;
  },

  updateFarmer: (id: string, updates: Partial<Omit<Farmer, 'id' | 'registeredDate'>>): Farmer | undefined => {
    const farmerIndex = farmers.findIndex(f => f.id === id);
    if (farmerIndex === -1) {
      return undefined;
    }
    const updatedFarmer = { ...farmers[farmerIndex], ...updates };
    farmers[farmerIndex] = updatedFarmer;
    return updatedFarmer;
  },

  // Batch methods
  getBatches: (): Batch[] => {
    return batches.sort((a, b) => {
        const dateA = new Date(a.collectionEvents[0].collectionDate).getTime();
        const dateB = new Date(b.collectionEvents[0].collectionDate).getTime();
        return dateB - dateA;
    });
  },

  getBatchesByFarmerId: (farmerId: string): Batch[] => {
    return batches.filter(batch => batch.collectionEvents.some(event => event.farmerId === farmerId));
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
