from flask import Flask, request, jsonify

app = Flask(__name__)

members = []

@app.route("/members", methods=["GET"])
def get_members():
    return jsonify(members)

@app.route("/members", methods=["POST"])
def add_member():
    data = request.json
    member = {
        "id": len(members) + 1,
        "name": data.get("name"),
        "email": data.get("email")
    }
    members.append(member)
    return jsonify(member), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)