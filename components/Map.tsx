import dynamic from 'next/dynamic';
import { Restaurant } from '@/lib/loadRestaurants';

const ClientMap = dynamic(
  () => import('./ClientMap').then((mod) => mod.ClientMap),
  { loading: () => <div>Loading map...</div>, ssr: false }
);

interface MapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function Map(props: MapProps) {
  return <ClientMap {...props} />;
}
