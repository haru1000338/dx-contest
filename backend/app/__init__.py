from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from backend.app.extensions import db  # ✅ extensions からのみインポート

def create_app():
    app = Flask(__name__)
    
    # 環境変数読み込み
    load_dotenv()

    # 設定
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:qwert12345@localhost:5432/pedarukakumei')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mysecret')

    # CORS
    CORS(app)

    # DB初期化
    db.init_app(app)

    # Blueprint登録
    from backend.app.routes.spot import spot_bp
    from backend.app.routes.stamp import stamp_bp
    from backend.app.routes.auth import auth_bp
    app.register_blueprint(spot_bp)
    app.register_blueprint(stamp_bp)
    app.register_blueprint(auth_bp)

    return app
