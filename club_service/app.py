from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

clubs = []


# ──────────────── Error Handlers ────────────────

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


# ──────────────── Health Check ────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "club_service", "port": 5001})


# ──────────────── Home ────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Club Service!", "endpoints": ["/clubs", "/health"]})


# ──────────────── GET all clubs ────────────────

@app.route("/clubs", methods=["GET"])
def get_clubs():
    return jsonify(clubs)


# ──────────────── POST create club ────────────────

@app.route("/clubs", methods=["POST"])
def add_club():
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Field 'name' is required"}), 400

    club = {
        "id": len(clubs) + 1,
        "name": data["name"],
        "description": data.get("description", ""),
        "category": data.get("category", "General"),
        "created_at": datetime.now().isoformat()
    }
    clubs.append(club)
    return jsonify(club), 201


# ──────────────── DELETE club ────────────────

@app.route("/clubs/<int:club_id>", methods=["DELETE"])
def delete_club(club_id):
    global clubs
    original_len = len(clubs)
    clubs = [c for c in clubs if c["id"] != club_id]

    if len(clubs) == original_len:
        return jsonify({"error": "Club not found"}), 404

    return jsonify({"message": "Club deleted successfully"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)