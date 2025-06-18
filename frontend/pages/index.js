import { useEffect, useState } from 'react';
import { getSpots } from '../lib/api';
import Link from 'next/link';

export default function Home() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    getSpots().then(setSpots);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">観光地一覧</h1>
      <ul>
        {spots.map((spot) => (
          <li key={spot.id} className="mb-2">
            <Link href={`/spot/${spot.id}`}>
              <a className="text-blue-600 underline">{spot.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}