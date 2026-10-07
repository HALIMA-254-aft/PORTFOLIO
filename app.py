from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from dotenv import load_dotenv
from datetime import datetime
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# ================================
# DATABASE CONFIGURATION
# ================================

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///portfolio.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ================================
# EMAIL CONFIGURATION
# ================================
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")
mail = Mail(app)


# ================================
# CONTACT MESSAGE MODEL
# ================================

class ContactMessage(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


# ================================
# HOME PAGE
# ================================

@app.route("/")
def home():
    return render_template("index.html")


# ================================
# CONTACT FORM
# ================================

@app.route("/api/contact", methods=["POST"])
def contact():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data was provided."
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    # Backend validation

    if not name:
        return jsonify({
            "success": False,
            "message": "Name is required."
        }), 400

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400

    if not message:
        return jsonify({
            "success": False,
            "message": "Message is required."
        }), 400

    if len(message) < 10:
        return jsonify({
            "success": False,
            "message": "Message must be at least 10 characters."
        }), 400

    # ================================
    # SAVE MESSAGE TO DATABASE
    # ================================

    new_message = ContactMessage(
        name=name,
        email=email,
        message=message
    )

    db.session.add(new_message)
    db.session.commit()

    # ================================
    # SEND EMAIL
    # ================================

    try:

        receiver = os.getenv("MAIL_RECEIVER")

        email_message = Message(
            subject=f"New Portfolio Message from {name}",
            sender=app.config["MAIL_USERNAME"],
            recipients=[receiver],
            reply_to=email
        )

        email_message.body = f"""
You received a new message through your portfolio website.

Name:
{name}

Email:
{email}

Message:
{message}
"""

        mail.send(email_message)

    except Exception as error:

        print("Email sending failed:", error)

        return jsonify({
            "success": False,
            "message": "Your message was saved, but the email could not be sent."
        }), 500

    return jsonify({
        "success": True,
        "message": "Your message has been sent successfully."
    }), 201


# ================================
# RUN APPLICATION
# ================================

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)