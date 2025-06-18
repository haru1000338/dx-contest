from flask import Blueprint, jsonify
from ..models.spot import Spot
from ..extensions import db

spot_bp = Blueprint('spot', __name__, url_prefix='/api/spots')

@spot_bp.route('/', methods=['GET'])
def get_spots():
    spots = Spot.query.all()
    return jsonify([s.to_dict() for s in spots])
