# 🔥 Club Management Microservices (AWS Ready)

## 🚀 Overview

This project is a **microservices-based Club Management System** built using Flask.
It demonstrates how to design and organize services independently while preparing for scalable cloud deployment using AWS.

The system is divided into multiple services handling different responsibilities such as clubs, members, and events.

---

## 🏗️ Architecture

The application follows a **microservices architecture**, where each service runs independently:

* **club_service** → Manages club data
* **member_service** → Handles member information
* **event_service** → Manages events
* **frontend** → User interface *(in progress)*

---

## ⚙️ Tech Stack

* **Backend:** Flask (Python)
* **Frontend:** HTML, CSS, JavaScript *(planned)*
* **Architecture:** Microservices
* **Deployment:** AWS *(planned)*

---

## 📂 Project Structure

```
club_service/
event_service/
member_service/
frontend/
requirements.txt
```

---

## ▶️ How to Run

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run Services Individually

Run each service in a separate terminal:

```bash
cd club_service
python app.py
```

Repeat for other services:

* `member_service` → runs on port **5002**
* `event_service` → runs on port **5003**

*(Make sure each service uses a different port)*

---

## 🔌 API Endpoints

### 📌 Clubs

* `GET /clubs` → Get all clubs
* `POST /clubs` → Create a club
* `DELETE /clubs/{id}` → Delete a club

### 👥 Members

* `GET /members` → Get all members
* `POST /members` → Add a member

### 🎉 Events

* `GET /events` → Get all events
* `POST /events` → Create an event

---

## 🧪 Future Improvements

* Add frontend UI
* Implement API Gateway
* Add authentication (JWT)
* Dockerize services
* Deploy to AWS (ECS / EC2 / Lambda)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
 
