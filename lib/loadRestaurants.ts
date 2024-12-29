import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface Restaurant {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  maps_url: string;
  score: number;
  notes?: string;
  visited?: string; // ISO date string format (YYYY-MM-DD)
}

interface RestaurantsData {
  restaurants: Restaurant[];
}

export function loadRestaurants(): Restaurant[] {
  const filePath = join(process.cwd(), 'data', 'restaurants.yaml');
  
  try {
    const fileContents = readFileSync(filePath, 'utf8');
    const data = load(fileContents) as RestaurantsData;
    return data.restaurants || [];
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}
