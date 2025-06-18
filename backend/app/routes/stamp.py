from flask import Blueprint, request, jsonify
from ..models.stamp import Stamp
from ..extensions import db

stamp_bp = Blueprint('stamp', __name__, url_prefix='/api/stamp')

@stamp_bp.route('/<int:user_id>/<int:spot_id>', methods=['POST'])
def stamp_spot(user_id, spot_id):
    stamp = Stamp(user_id=user_id, spot_id=spot_id)
    db.session.add(stamp)
    db.session.commit()
    return jsonify({'status': 'stamped'})

@stamp_bp.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    stamps = Stamp.query.filter_by(user_id=user_id).all()
    return jsonify([s.to_dict() for s in stamps])
