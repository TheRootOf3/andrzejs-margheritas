import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export interface Restaurant {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  maps_url: string;
  group: string;
  score: number;
  notes: string;
}

export function loadRestaurants(): Restaurant[] {
  const filePath = path.join(process.cwd(), 'data', 'restaurants.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents) as { restaurants: Restaurant[] };
  return data.restaurants;
}
