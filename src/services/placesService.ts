import axios from 'axios';

export interface PlaceSuggestion {
  name: string;
  address: string;
  type: string;
  rating?: number;
  isOutdoor?: boolean;
}

const PLACE_TYPES = [
  'park',
  'museum',
  'cafe',
  'library',
  'art_gallery',
  'shopping_mall',
  'zoo',
  'movie_theater'
];

export async function getNearbyPlaces(location: string): Promise<PlaceSuggestion[]> {
  const apiKey = process.env.GOOGLE_API_KEY;

  // For simplicity: assume "location" is a city name and we geocode it
  const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  const geoRes = await axios.get(geoUrl);
  const coords = geoRes.data.results[0]?.geometry.location;

  if (!coords) {
    throw new Error('Could not geocode location');
  }

  const { lat, lng } = coords;

  const places: PlaceSuggestion[] = [];

  for (const type of PLACE_TYPES) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${apiKey}`;
    const res = await axios.get(url);

    const results = res.data.results || [];

    results.forEach((place: any) => {
      places.push({
        name: place.name,
        address: place.vicinity,
        type,
        rating: place.rating,
        isOutdoor: ['park', 'zoo'].includes(type)
      });
    });
  }

  return places;
}
