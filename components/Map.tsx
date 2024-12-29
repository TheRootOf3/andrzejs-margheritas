import dynamic from 'next/dynamic';
import { Restaurant } from '@/lib/loadRestaurants';

const ClientMap = dynamic(() => import('./ClientMap').then(mod => mod.ClientMap), {
  ssr: false
});

interface MapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function Map(props: MapProps) {
  return <ClientMap {...props} />;
}
