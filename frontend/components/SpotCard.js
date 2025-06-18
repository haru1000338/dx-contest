export default function SpotCard({ spot }) {
  return (
    <div className="border rounded p-4 shadow-md">
      <h2 className="text-lg font-bold">{spot.name}</h2>
      <p className="text-gray-600">{spot.location}</p>
      <p className="mt-2">{spot.description}</p>
    </div>
  );
}