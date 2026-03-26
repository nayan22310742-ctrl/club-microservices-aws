from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

members = []


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
    return jsonify({"status": "ok", "service": "member_service", "port": 5002})


# ──────────────── Home ────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Member Service!", "endpoints": ["/members", "/health"]})


# ──────────────── GET all members ────────────────

@app.route("/members", methods=["GET"])
def get_members():
    return jsonify(members)


# ──────────────── POST create member ────────────────

@app.route("/members", methods=["POST"])
def add_member():
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Field 'name' is required"}), 400

    if not data.get("email"):
        return jsonify({"error": "Field 'email' is required"}), 400

    member = {
        "id": len(members) + 1,
        "name": data["name"],
        "email": data["email"],
        "club_id": data.get("club_id", None),
        "joined_at": datetime.now().isoformat()
    }
    members.append(member)
    return jsonify(member), 201


# ──────────────── DELETE member ────────────────

@app.route("/members/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    global members
    original_len = len(members)
    members = [m for m in members if m["id"] != member_id]

    if len(members) == original_len:
        return jsonify({"error": "Member not found"}), 404

    return jsonify({"message": "Member deleted successfully"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)