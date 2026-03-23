from flask import Flask, request, jsonify

app = Flask(__name__)

events = []

@app.route("/events", methods=["GET"])
def get_events():
    return jsonify(events)

@app.route("/events", methods=["POST"])
def add_event():
    data = request.json
    event = {
        "id": len(events) + 1,
        "name": data.get("name")
    }
    events.append(event)
    return jsonify(event), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)