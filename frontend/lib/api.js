export async function getSpots() {
  const res = await fetch('http://localhost:5000/api/spots/');
  return res.json();
}

export async function getSpot(id) {
  const res = await fetch(`http://localhost:5000/api/spots/${id}`);
  return res.json();
}

export async function stampSpot(userId, spotId) {
  await fetch(`http://localhost:5000/api/stamp/${userId}/${spotId}`, { method: 'POST' });
}

export async function getProgress(userId) {
  const res = await fetch(`http://localhost:5000/api/stamp/progress/${userId}`);
  return res.json();
}

export async function signup(username, password) {
  const res = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}