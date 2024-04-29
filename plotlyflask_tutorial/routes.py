from flask import render_template, redirect
from flask import current_app as app
from flask_login import login_required, current_user


@app.route("/dizajn")
def home():
    return render_template("dizajn.html", user=current_user)


@app.route("/account")
@login_required
def account():
    return render_template("account.html", user=current_user)


@app.route("/help")
def help():
    return render_template("help.html", user=current_user)


@app.route("/")
def first():
    return render_template("home.html", user=current_user)


@app.route("/ik")
def firstgg():
    return render_template("three.html", user=current_user)


@app.route("/three")
def threfafafafae():
    return render_template("js.html", user=current_user)
