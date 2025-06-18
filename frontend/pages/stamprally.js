import { useEffect, useState } from 'react';
import { getProgress, stampSpot } from '../lib/api';

export default function StampRally() {
  const [userId, setUserId] = useState(1); // 仮のログインユーザーID
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    getProgress(userId).then(setProgress);
  }, [userId]);

  const handleStamp = (spotId) => {
    stampSpot(userId, spotId).then(() => {
      getProgress(userId).then(setProgress);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">スタンプラリー</h1>
      <ul>
        {progress.map((s) => (
          <li key={s.spot_id}>
            スポットID: {s.spot_id} — 取得済
          </li>
        ))}
      </ul>
      <button onClick={() => handleStamp(99)} className="mt-4 bg-blue-500 text-white p-2 rounded">
        スポットID 99 をスタンプ
      </button>
    </div>
  );
}