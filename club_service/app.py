from flask import Flask, request, jsonify

app = Flask(__name__)

clubs = []

@app.route("/clubs", methods=["GET"])
def get_clubs():
    return jsonify(clubs)

@app.route("/clubs", methods=["POST"])
def add_club():
    data = request.json
    club = {
        "id": len(clubs) + 1,
        "name": data.get("name")
    }
    clubs.append(club)
    return jsonify(club), 201

@app.route("/clubs/<int:club_id>", methods=["DELETE"])
def delete_club(club_id):
    global clubs
    clubs = [c for c in clubs if c["id"] != club_id]
    return jsonify({"message": "Club deleted"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)