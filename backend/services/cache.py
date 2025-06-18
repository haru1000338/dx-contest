import redis
import json

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

def cache_progress(user_id, progress):
    r.set(f"progress:{user_id}", json.dumps(progress), ex=3600)

def get_cached_progress(user_id):
    data = r.get(f"progress:{user_id}")
    return json.loads(data) if data else None