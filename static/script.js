const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks");
const formMessage = document.getElementById("form-message");

const STORAGE_KEY = "student_task_prioritizer_tasks_v1";
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// Seed data used only once when localStorage is empty.
const DEFAULT_TASKS = [
  {
    id: "seed-1",
    title: "Math assignment chapter 5",
    description: "Solve exercises 1-20 and review formulas.",
    course: "Mathematics",
    deadline: "2026-04-25",
    priority: "high",
    completed: false,
    created_at: "2026-04-20T10:00:00Z",
  },
  {
    id: "seed-2",
    title: "History reading summary",
    description: "Write a one-page summary about World War I causes.",
    course: "History",
    deadline: "2026-04-29",
    priority: "medium",
    completed: false,
    created_at: "2026-04-21T12:30:00Z",
  },
];

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function parseDate(dateText) {
  return new Date(`${dateText}T00:00:00`);
}

function daysLeft(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDate(deadline) - today) / (1000 * 60 * 60 * 24));
}

function withComputedFields(task) {
  const days_left = daysLeft(task.deadline);
  return {
    ...task,
    days_left,
    is_urgent: !task.completed && days_left >= 0 && days_left <= 3,
  };
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const dateDiff = parseDate(a.deadline) - parseDate(b.deadline);
    if (dateDiff !== 0) return dateDiff;
    return (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
  });
}

function ensureSeedData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
  }
}

function readTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function showMessage(message, color = "#1d4ed8") {
  formMessage.textContent = message;
  formMessage.style.color = color;
}

function taskBadges(task) {
  const badges = [];
  if (task.is_urgent) badges.push('<span class="badge urgent">Urgent</span>');
  if (task.completed) badges.push('<span class="badge completed">Completed</span>');
  return badges.join("");
}

function taskMeta(task) {
  const dueText =
    task.days_left < 0
      ? `${Math.abs(task.days_left)} day(s) overdue`
      : `${task.days_left} day(s) left`;

  return `
    <p><strong>Course:</strong> ${escapeHtml(task.course)}</p>
    <p><strong>Deadline:</strong> ${escapeHtml(task.deadline)} (${dueText})</p>
    <p><strong>Priority:</strong> ${escapeHtml(task.priority)}</p>
    <p>${escapeHtml(task.description)}</p>
  `;
}

function renderTasks() {
  const tasks = sortTasks(readTasks()).map(withComputedFields);

  if (!tasks.length) {
    tasksContainer.innerHTML = "<p>No tasks yet. Add your first task above.</p>";
    return;
  }

  tasksContainer.innerHTML = tasks
    .map(
      (task) => `
      <article class="task priority-${task.priority} ${task.is_urgent ? "urgent" : ""} ${
        task.completed ? "completed" : ""
      }">
        <div class="task-header">
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          <div class="badges">${taskBadges(task)}</div>
        </div>
        ${taskMeta(task)}
        <div class="actions">
          ${
            task.completed
              ? ""
              : `<button type="button" onclick="completeTask('${task.id}')">Mark Completed</button>`
          }
          <button type="button" class="delete" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      </article>
      `
    )
    .join("");
}

function completeTask(taskId) {
  const tasks = readTasks().map((task) =>
    task.id === taskId ? { ...task, completed: true } : task
  );
  writeTasks(tasks);
  renderTasks();
}

function deleteTask(taskId) {
  const tasks = readTasks().filter((task) => task.id !== taskId);
  writeTasks(tasks);
  renderTasks();
}

function validateFormPayload(payload) {
  if (!payload.title || !payload.description || !payload.course || !payload.deadline) {
    return "Please fill all fields.";
  }
  if (!["low", "medium", "high"].includes(payload.priority)) {
    return "Priority must be low, medium, or high.";
  }
  return null;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    course: document.getElementById("course").value.trim(),
    deadline: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
  };

  const validationError = validateFormPayload(payload);
  if (validationError) {
    showMessage(validationError, "#b91c1c");
    return;
  }

  const tasks = readTasks();
  tasks.push({
    ...payload,
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    completed: false,
    created_at: new Date().toISOString(),
  });
  writeTasks(tasks);

  taskForm.reset();
  showMessage("Task added successfully.", "#166534");
  renderTasks();
});

window.completeTask = completeTask;
window.deleteTask = deleteTask;

ensureSeedData();
renderTasks();
