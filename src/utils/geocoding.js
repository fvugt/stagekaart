// Free geocoding service using OpenStreetMap Nominatim
// Rate limit: 1 request per second

const geocodeAddress = async (address, city = '') => {
  try {
    // Add city to improve accuracy for Netherlands addresses
    const searchQuery = city ? `${address}, ${city}, Netherlands` : `${address}, Netherlands`;
    
    console.log(`Geocoding: ${searchQuery}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=nl&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.length > 0) {
      const result = data[0];
      const coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
      
      console.log(`Found coordinates for ${address}:`, coordinates);
      console.log(`Full address: ${result.display_name}`);
      
      return {
        coordinates,
        displayName: result.display_name,
        confidence: result.importance
      };
    } else {
      console.warn(`No coordinates found for: ${searchQuery}`);
      return null;
    }
  } catch (error) {
    console.error(`Geocoding error for ${address}:`, error);
    return null;
  }
};

// Batch geocode multiple addresses with rate limiting
const geocodeAddresses = async (addresses, delayMs = 1100) => {
  const results = [];
  
  for (let i = 0; i < addresses.length; i++) {
    const { address, city, companyName } = addresses[i];
    
    console.log(`Processing ${i + 1}/${addresses.length}: ${companyName}`);
    
    const result = await geocodeAddress(address, city);
    results.push({
      companyName,
      address,
      city,
      ...result
    });
    
    // Rate limiting: wait between requests
    if (i < addresses.length - 1) {
      console.log(`Waiting ${delayMs}ms before next request...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
};

export { geocodeAddress, geocodeAddresses };

