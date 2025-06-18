from backend.app import create_app
from backend.app.extensions import db

app = create_app()

with app.app_context():
    db.create_all()
    print("✔ データベースの初期化に成功しました。")
