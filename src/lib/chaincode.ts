// This file simulates a blockchain chaincode or smart contract.

interface CollectionEventData {
  species: string;
  location: {
    coordinates: [number, number]; // [latitude, longitude]
  };
}

export class TraceabilityContract {
  /**
   * Simulates recording a collection event on the blockchain.
   * Includes validation logic that would typically reside in a smart contract.
   * @param eventData - The data for the collection event.
   */
  public recordCollectionEvent(eventData: CollectionEventData): { success: true; message: string } {
    // 1. Check if the species is permitted
    const permittedSpecies = ['Ashwagandha', 'Brahmi', 'Tulsi', 'Neem', 'Turmeric', 'Ginger'];
    if (!permittedSpecies.includes(eventData.species)) {
      throw new Error(`Species "${eventData.species}" is not a permitted species for collection.`);
    }

    // 2. Check if the location is within the valid geo-fence for Lucknow, India
    const [lat, lon] = eventData.location.coordinates;
    const isLocalTest = lat === 0 && lon === 0; // Allow a test coordinate
    
    // Geo-fence for Lucknow, India: Latitude between 26.8 and 26.9, Longitude between 80.9 and 81.0
    const inGeoFence = (lat >= 26.8 && lat <= 26.9) && (lon >= 80.9 && lon <= 81.0);

    if (!inGeoFence && !isLocalTest) {
      throw new Error('Location is outside the permitted geo-fence for Lucknow.');
    }

    // If all checks pass, return a success object.
    // In a real blockchain, this would commit the transaction to the ledger.
    return { success: true, message: 'Collection event validated and recorded successfully.' };
  }
}
