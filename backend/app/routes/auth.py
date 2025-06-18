# backend/app/routes/auth.py

from flask import Blueprint, request, jsonify
from backend.app.models.user import User
from backend.app.extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'username and password required'}), 400

    user = User(username=data['username'], password=data['password'])  # 本番ではパスワードはハッシュ化するべき！
    db.session.add(user)
    db.session.commit()
    return jsonify({'user_id': user.id})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({'user_id': user.id})
    return jsonify({'error': 'invalid credentials'}), 401
