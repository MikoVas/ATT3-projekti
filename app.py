from __future__ import annotations

import json
import os
from datetime import date, datetime
from typing import Any
from uuid import uuid4

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DATA_FILE = os.path.join("data", "tasks.json")
PRIORITY_ORDER = {"high": 0, "medium": 1, "low": 2}


def ensure_data_file() -> None:
    """Create the JSON storage file if it does not exist yet."""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)


def load_tasks() -> list[dict[str, Any]]:
    """Read all tasks from disk and return as a Python list."""
    ensure_data_file()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        tasks = json.load(f)

    if not isinstance(tasks, list):
        # Defensive fallback if file content is malformed.
        return []
    return tasks


def save_tasks(tasks: list[dict[str, Any]]) -> None:
    """Persist all tasks to disk in pretty JSON format."""
    ensure_data_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)


def parse_deadline(deadline_text: str) -> date:
    """Parse ISO date string from input; raise ValueError when invalid."""
    return datetime.strptime(deadline_text, "%Y-%m-%d").date()


def days_until(deadline_text: str) -> int:
    """Return number of days from today until deadline (negative if overdue)."""
    deadline = parse_deadline(deadline_text)
    return (deadline - date.today()).days


def sort_tasks(tasks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Sort by deadline first and then by priority rank (high before low)."""

    def sort_key(task: dict[str, Any]) -> tuple[date, int]:
        deadline = parse_deadline(task["deadline"])
        priority_rank = PRIORITY_ORDER.get(task.get("priority", "low"), 3)
        return (deadline, priority_rank)

    return sorted(tasks, key=sort_key)


def enrich_task(task: dict[str, Any]) -> dict[str, Any]:
    """Attach computed UI helper fields without mutating original task."""
    task_copy = dict(task)
    task_copy["days_left"] = days_until(task_copy["deadline"])
    # Urgent if deadline is within 3 days and task is still active.
    task_copy["is_urgent"] = (not task_copy.get("completed", False)) and (
        0 <= task_copy["days_left"] <= 3
    )
    return task_copy


@app.route("/")
def index() -> str:
    return render_template("index.html")


@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = sort_tasks(load_tasks())
    return jsonify([enrich_task(t) for t in tasks])


@app.route("/tasks", methods=["POST"])
def add_task():
    payload = request.get_json(silent=True) or {}

    required_fields = ["title", "description", "course", "deadline", "priority"]
    missing_fields = [f for f in required_fields if not str(payload.get(f, "")).strip()]
    if missing_fields:
        return (
            jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}),
            400,
        )

    priority = str(payload["priority"]).lower().strip()
    if priority not in PRIORITY_ORDER:
        return jsonify({"error": "Priority must be one of: low, medium, high"}), 400

    try:
        parse_deadline(str(payload["deadline"]))
    except ValueError:
        return jsonify({"error": "Deadline must be in YYYY-MM-DD format"}), 400

    tasks = load_tasks()
    task = {
        "id": str(uuid4()),
        "title": str(payload["title"]).strip(),
        "description": str(payload["description"]).strip(),
        "course": str(payload["course"]).strip(),
        "deadline": str(payload["deadline"]).strip(),
        "priority": priority,
        "completed": False,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    tasks.append(task)
    save_tasks(tasks)

    return jsonify(enrich_task(task)), 201


@app.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id: str):
    tasks = load_tasks()
    filtered = [task for task in tasks if task.get("id") != task_id]

    if len(filtered) == len(tasks):
        return jsonify({"error": "Task not found"}), 404

    save_tasks(filtered)
    return jsonify({"message": "Task deleted"}), 200


@app.route("/tasks/<task_id>/complete", methods=["PUT"])
def complete_task(task_id: str):
    tasks = load_tasks()

    for task in tasks:
        if task.get("id") == task_id:
            task["completed"] = True
            save_tasks(tasks)
            return jsonify(enrich_task(task)), 200

    return jsonify({"error": "Task not found"}), 404


if __name__ == "__main__":
    ensure_data_file()
    app.run(debug=True)
