export default function SharePage() {
  const shareText = encodeURIComponent('HACHI-MEGURI スタンプラリーを完走しました！');
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">思い出を共有</h1>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded">
        Twitter でシェアする
      </a>
    </div>
  );
}