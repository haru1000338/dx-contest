export default function StampProgress({ progress, total }) {
  const percentage = ((progress.length / total) * 100).toFixed(0);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">スタンプ進捗</h3>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="mt-1 text-sm text-gray-700">{progress.length} / {total} ({percentage}%)</p>
    </div>
  );
}