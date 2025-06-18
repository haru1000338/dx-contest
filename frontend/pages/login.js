import { useState } from 'react';
import { login } from '../lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    setUserId(res.user_id);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ユーザー名" className="border p-2 w-full" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="パスワード" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">ログイン</button>
      </form>
      {userId && <p className="mt-4 text-green-600">ログイン成功: ユーザーID {userId}</p>}
    </div>
  );
}