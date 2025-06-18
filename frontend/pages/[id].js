import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSpot } from '../../lib/api';

export default function SpotDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (id) getSpot(id).then(setSpot);
  }, [id]);

  if (!spot) return <p>読み込み中...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{spot.name}</h1>
      <p>{spot.description}</p>
      <p className="text-gray-600">場所: {spot.location}</p>
      <p className="text-gray-600">カテゴリ: {spot.category}</p>
    </div>
  );
}