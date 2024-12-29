import dynamic from 'next/dynamic';
import { Restaurant } from '@/lib/loadRestaurants';

const ClientMap = dynamic(
  () => import('./ClientMap').then((mod) => mod.ClientMap),
  { 
    loading: () => <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>,
    ssr: false 
  }
);

interface MapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function Map(props: MapProps) {
  return <ClientMap {...props} />;
}
