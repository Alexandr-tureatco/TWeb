from flask import Flask, request, jsonify, send_from_directory, session, redirect
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__)
app.secret_key = "ekZeG:JoO4$tvC]c&q+G@o=3xuw*}X9P/C.V%zoS" 
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "users.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

with get_db_connection() as conn:
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)


@app.before_request
def restrict_access():
    public_files = [
        'login.html', 'registration.html', 
        'stylereg.css', 'style.css','stylenews.css',
    ]
    public_endpoints = ['login_api', 'register_api', 'serve_root']

    if 'user_id' in session:
        return
    
    if request.endpoint == 'static_files':
        requested_path = request.view_args.get('path')
        if requested_path not in public_files and not requested_path.startswith('img/'):
            return redirect("/")
    
    elif request.endpoint not in public_endpoints:
        return redirect("/")


@app.route("/")
def serve_root():
    if 'user_id' in session:
        return redirect("/index.html")
    return send_from_directory(BASE_DIR, "login.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(BASE_DIR, path)

@app.route("/register", methods=["POST"])
def register_api():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    
    hashed = generate_password_hash(password)
    try:
        with get_db_connection() as conn:
            conn.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                         (username, email, hashed))
        return jsonify({"message": "Регистрация завершена", "redirect": "/login.html"})
    except sqlite3.IntegrityError:
        return jsonify({"message": "❌ Ошибка: логин или email занят"}), 400

@app.route("/login", methods=["POST"])
def login_api():
    email = request.form.get("email")
    password = request.form.get("password")
    
    with get_db_connection() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    
    if user and check_password_hash(user["password"], password):
        session["user_id"] = user["id"]
        session["username"] = user["username"] 
        return jsonify({"message": "✅ Доступ разрешен", "redirect": "/index.html"})
    
    return jsonify({"message": "❌ Неверный пароль"}), 401


@app.route("/api/me")
def get_me():

    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    

    current_username = session.get("username")
    
    return jsonify({
        "username": current_username
    })

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

if __name__ == "__main__":
    app.run(host="localhost", port=5501, debug=True)