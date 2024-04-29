from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from plotlyflask_tutorial.models import User, Note
from werkzeug.security import generate_password_hash, check_password_hash
from plotlyflask_tutorial import db
from flask_login import (
    login_user,
    login_required,
    logout_user,
    current_user,
)
import json

auth = Blueprint("auth", __name__)


@auth.route("/get_robot_id/<string:robot_id>", methods=["POST"])
def get_robot_id(robot_id):
    if request.method == "POST":
        if current_user.is_authenticated:
            id = json.loads(robot_id)
            new_note = Note(data=id, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
        else:
            flash("You are not logged in.", category="error")

    return redirect("/")


@auth.route("/delete-note", methods=["POST"])
@login_required
def delete_note():
    note = json.loads(request.data)
    noteId = note["noteId"]
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})


@auth.route("/log-out")
@login_required
def logout():
    logout_user()
    return redirect("/")


@auth.route("/dizajn", methods=["GET", "POST"])
def login_dizajn():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("firstName")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        print(first_name, password1, password2)
        user = User.query.filter_by(email=email).first()
        if(password != None):
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=True)
                    return redirect("/account")
                else:
                    flash("Wrong password, try again.", category="error")
            else:
                flash("Email doesn't belong to any account.", category="error")

        else:
            if user:
                flash("Account with this email already exists.", category="error")
            elif password1 != password2:
                flash("Passwords don't match.", category="error")
            elif len(password1) < 3:
                flash("Password must be at least 4 characters long",
                      category="error")

            else:
                new_user = User(
                    email=email,
                    first_name=first_name,
                    password=generate_password_hash(
                        password1, method="sha256"),
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                return redirect("/account")

    return render_template("dizajn.html", user=current_user)


@auth.route("/help", methods=["GET", "POST"])
def login_help():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("firstName")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        print(first_name, password1, password2)
        user = User.query.filter_by(email=email).first()
        if(password != None):
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=True)
                    return redirect("/account")
                else:
                    flash("Wrong password, try again.", category="error")
            else:
                flash("Email doesn't belong to any account.", category="error")

        else:
            if user:
                flash("Account with this email already exists.", category="error")
            elif password1 != password2:
                flash("Passwords don't match.", category="error")
            elif len(password1) < 3:
                flash("Password must be at least 4 characters long",
                      category="error")

            else:
                new_user = User(
                    email=email,
                    first_name=first_name,
                    password=generate_password_hash(
                        password1, method="sha256"),
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                return redirect("/account")

    return render_template("help.html", user=current_user)


@auth.route("/ik", methods=["GET", "POST"])
def login_homde():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("firstName")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        print(first_name, password1, password2)
        user = User.query.filter_by(email=email).first()
        if(password != None):
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=True)
                    return redirect("/account")
                else:
                    flash("Wrong password, try again.", category="error")
            else:
                flash("Email doesn't belong to any account.", category="error")

        else:
            if user:
                flash("Account with this email already exists.", category="error")
            elif password1 != password2:
                flash("Passwords don't match.", category="error")
            elif len(password1) < 3:
                flash("Password must be at least 4 characters long",
                      category="error")

            else:
                new_user = User(
                    email=email,
                    first_name=first_name,
                    password=generate_password_hash(
                        password1, method="sha256"),
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                return redirect("/account")

    return render_template("three.html", user=current_user)


@auth.route("/", methods=["GET", "POST"])
def login_home():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("firstName")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        print(first_name, password1, password2)
        user = User.query.filter_by(email=email).first()
        if(password != None):
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=True)
                    return redirect("/account")
                else:
                    flash("Wrong password, try again.", category="error")
            else:
                flash("Email doesn't belong to any account.", category="error")

        else:
            if user:
                flash("Account with this email already exists.", category="error")
            elif password1 != password2:
                flash("Passwords don't match.", category="error")
            elif len(password1) < 3:
                flash("Password must be at least 4 characters long",
                      category="error")

            else:
                new_user = User(
                    email=email,
                    first_name=first_name,
                    password=generate_password_hash(
                        password1, method="sha256"),
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                return redirect("/account")

    return render_template("home.html", user=current_user)


@auth.route("/account", methods=["GET", "POST"])
@login_required
def logidn_home():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("firstName")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        print(first_name, password1, password2)
        user = User.query.filter_by(email=email).first()
        if(password != None):
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=True)
                    return redirect("/account")
                else:
                    flash("Wrong password, try again.", category="error")
            else:
                flash("Email doesn't belong to any account.", category="error")

        else:
            if user:
                flash("Account with this email already exists.", category="error")
            elif password1 != password2:
                flash("Passwords don't match.", category="error")
            elif len(password1) < 3:
                flash("Password must be at least 4 characters long",
                      category="error")

            else:
                new_user = User(
                    email=email,
                    first_name=first_name,
                    password=generate_password_hash(
                        password1, method="sha256"),
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                return redirect("/account")

    return render_template("account.html", user=current_user)


@auth.route("/three", methods=["GET", "POST"])
def logidn_three():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("firstName")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        print(first_name, password1, password2)
        user = User.query.filter_by(email=email).first()
        if(password != None):
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=True)
                    return redirect("/account")
                else:
                    flash("Wrong password, try again.", category="error")
            else:
                flash("Email doesn't belong to any account.", category="error")

        else:
            if user:
                flash("Account with this email already exists.", category="error")
            elif password1 != password2:
                flash("Passwords don't match.", category="error")
            elif len(password1) < 3:
                flash("Password must be at least 4 characters long",
                      category="error")

            else:
                new_user = User(
                    email=email,
                    first_name=first_name,
                    password=generate_password_hash(
                        password1, method="sha256"),
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                return redirect("/account")

    return render_template("three.html", user=current_user)
