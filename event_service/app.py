from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

events = []


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
    return jsonify({"status": "ok", "service": "event_service", "port": 5003})


# ──────────────── Home ────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Event Service!", "endpoints": ["/events", "/health"]})


# ──────────────── GET all events ────────────────

@app.route("/events", methods=["GET"])
def get_events():
    return jsonify(events)


# ──────────────── POST create event ────────────────

@app.route("/events", methods=["POST"])
def add_event():
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Field 'title' is required"}), 400

    event = {
        "id": len(events) + 1,
        "title": data["title"],
        "description": data.get("description", ""),
        "club_id": data.get("club_id", None),
        "date": data.get("date", datetime.now().strftime("%Y-%m-%d")),
        "created_at": datetime.now().isoformat()
    }
    events.append(event)
    return jsonify(event), 201


# ──────────────── DELETE event ────────────────

@app.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    global events
    original_len = len(events)
    events = [e for e in events if e["id"] != event_id]

    if len(events) == original_len:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({"message": "Event deleted successfully"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)