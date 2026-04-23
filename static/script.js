const APP_VERSION = "v1.2.0";
const STORAGE_KEY = "student_task_prioritizer_tasks_v1";
const LANG_KEY = "student_task_prioritizer_lang";
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const el = {
  taskForm: document.getElementById("task-form"),
  activeTasks: document.getElementById("active-tasks"),
  completedTasks: document.getElementById("completed-tasks"),
  formMessage: document.getElementById("form-message"),
  stats: document.getElementById("stats"),
  priorityChart: document.getElementById("priority-chart"),
  statusChart: document.getElementById("status-chart"),
  langToggle: document.getElementById("language-toggle"),
  versionBadge: document.getElementById("version-badge"),
};

const I18N = {
  fi: {
    valueProposition:
      "Hallitse kaikki opiskelutehtävät yhdessä värikkäässä näkymässä ja näe tärkeimmät tehtävät nopeasti.",
    addTaskTitle: "Lisää uusi tehtävä",
    title: "Otsikko",
    course: "Kurssi",
    description: "Kuvaus",
    deadline: "Deadline",
    priority: "Prioriteetti",
    low: "Matala",
    medium: "Keskitaso",
    high: "Korkea",
    addTaskButton: "Lisää tehtävä",
    statsTitle: "Tehtävätilastot",
    priorityDistribution: "Prioriteettijakauma",
    statusSplit: "Tilajakauma",
    activeTasksTitle: "Aktiiviset tehtävät",
    completedTasksTitle: "Valmiit tehtävät (Arkisto)",
    total: "Yhteensä",
    active: "Aktiiviset",
    completed: "Valmiit",
    urgent: "Kiireelliset",
    overdue: "Myöhässä",
    noActive: "Ei aktiivisia tehtäviä. Hienoa!",
    noCompleted: "Ei vielä valmiita tehtäviä.",
    noTasks: "Ei tehtäviä vielä.",
    markCompleted: "Merkitse valmiiksi",
    delete: "Poista",
    urgentBadge: "Kiireellinen",
    completedBadge: "Valmis",
    daysLeft: "pv jäljellä",
    daysOverdue: "pv myöhässä",
    courseLabel: "Kurssi:",
    deadlineLabel: "Deadline:",
    priorityLabel: "Prioriteetti:",
    fillAllFields: "Täytä kaikki kentät.",
    invalidPriority: "Prioriteetin pitää olla low, medium tai high.",
    taskAdded: "Tehtävä lisätty onnistuneesti.",
    langBtn: "EN",
  },
  en: {
    valueProposition:
      "Manage all study tasks in one colorful view and quickly spot what needs attention first.",
    addTaskTitle: "Add New Task",
    title: "Title",
    course: "Course",
    description: "Description",
    deadline: "Deadline",
    priority: "Priority",
    low: "Low",
    medium: "Medium",
    high: "High",
    addTaskButton: "Add Task",
    statsTitle: "Task Statistics",
    priorityDistribution: "Priority Distribution",
    statusSplit: "Status Split",
    activeTasksTitle: "Active Tasks",
    completedTasksTitle: "Completed Tasks (Archive)",
    total: "Total",
    active: "Active",
    completed: "Completed",
    urgent: "Urgent",
    overdue: "Overdue",
    noActive: "No active tasks. Great job!",
    noCompleted: "No completed tasks yet.",
    noTasks: "No tasks yet.",
    markCompleted: "Mark Completed",
    delete: "Delete",
    urgentBadge: "Urgent",
    completedBadge: "Completed",
    daysLeft: "day(s) left",
    daysOverdue: "day(s) overdue",
    courseLabel: "Course:",
    deadlineLabel: "Deadline:",
    priorityLabel: "Priority:",
    fillAllFields: "Please fill all fields.",
    invalidPriority: "Priority must be low, medium, or high.",
    taskAdded: "Task added successfully.",
    langBtn: "FI",
  },
};

let currentLang = localStorage.getItem(LANG_KEY) || "fi";

const DEFAULT_TASKS = [
  { id: "seed-1", title: "Math assignment chapter 5", description: "Solve exercises 1-20 and review formulas.", course: "Mathematics", deadline: "2026-04-25", priority: "high", completed: false, created_at: "2026-04-20T10:00:00Z" },
  { id: "seed-2", title: "History reading summary", description: "Write a one-page summary about World War I causes.", course: "History", deadline: "2026-04-29", priority: "medium", completed: false, created_at: "2026-04-21T12:30:00Z" },
  { id: "seed-3", title: "Chemistry lab notes", description: "Complete pre-lab notes and formulas.", course: "Chemistry", deadline: "2026-04-24", priority: "high", completed: true, created_at: "2026-04-19T09:15:00Z" },
];

const t = (key) => I18N[currentLang][key] || key;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function parseDate(dateText) { return new Date(`${dateText}T00:00:00`); }

function daysLeft(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDate(deadline) - today) / (1000 * 60 * 60 * 24));
}

function withComputedFields(task) {
  const d = daysLeft(task.deadline);
  return { ...task, days_left: d, is_urgent: !task.completed && d >= 0 && d <= 3 };
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const dd = parseDate(a.deadline) - parseDate(b.deadline);
    if (dd !== 0) return dd;
    return (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
  });
}

function ensureSeedData() {
  if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
}

function readTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeTasks(tasks) { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

function showMessage(message, color = "#1d4ed8") {
  el.formMessage.textContent = message;
  el.formMessage.style.color = color;
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.getElementById("value-proposition").textContent = t("valueProposition");
  document.getElementById("add-task-title").textContent = t("addTaskTitle");
  document.getElementById("label-title").textContent = t("title");
  document.getElementById("label-course").textContent = t("course");
  document.getElementById("label-description").textContent = t("description");
  document.getElementById("label-deadline").textContent = t("deadline");
  document.getElementById("label-priority").textContent = t("priority");
  document.getElementById("opt-low").textContent = t("low");
  document.getElementById("opt-medium").textContent = t("medium");
  document.getElementById("opt-high").textContent = t("high");
  document.getElementById("add-task-button").textContent = t("addTaskButton");
  document.getElementById("stats-title").textContent = t("statsTitle");
  document.getElementById("priority-distribution-title").textContent = t("priorityDistribution");
  document.getElementById("status-split-title").textContent = t("statusSplit");
  document.getElementById("active-tasks-title").textContent = t("activeTasksTitle");
  document.getElementById("completed-tasks-title").textContent = t("completedTasksTitle");
  el.langToggle.textContent = t("langBtn");
  el.versionBadge.textContent = APP_VERSION;
}

function taskBadges(task) {
  const badges = [];
  if (task.is_urgent) badges.push(`<span class="badge urgent">${t("urgentBadge")}</span>`);
  if (task.completed) badges.push(`<span class="badge completed">${t("completedBadge")}</span>`);
  return badges.join("");
}

function taskMeta(task) {
  const dueText = task.days_left < 0 ? `${Math.abs(task.days_left)} ${t("daysOverdue")}` : `${task.days_left} ${t("daysLeft")}`;
  return `
    <p><strong>${t("courseLabel")}</strong> ${escapeHtml(task.course)}</p>
    <p><strong>${t("deadlineLabel")}</strong> ${escapeHtml(task.deadline)} (${dueText})</p>
    <p><strong>${t("priorityLabel")}</strong> ${escapeHtml(task.priority)}</p>
    <p>${escapeHtml(task.description)}</p>
  `;
}

function taskCard(task) {
  return `
    <article class="task priority-${task.priority} ${task.is_urgent ? "urgent" : ""} ${task.completed ? "completed" : ""}">
      <div class="task-header">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <div class="badges">${taskBadges(task)}</div>
      </div>
      ${taskMeta(task)}
      <div class="actions">
        ${task.completed ? "" : `<button type="button" onclick="completeTask('${task.id}')">${t("markCompleted")}</button>`}
        <button type="button" class="delete" onclick="deleteTask('${task.id}')">${t("delete")}</button>
      </div>
    </article>
  `;
}

function barRow(label, value, total, fillClass) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill ${fillClass}" style="width:${percent}%"></div></div><strong>${value}</strong></div>`;
}

function renderStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((x) => x.completed).length;
  const active = total - completed;
  const urgent = tasks.filter((x) => x.is_urgent).length;
  const overdue = tasks.filter((x) => !x.completed && x.days_left < 0).length;

  el.stats.innerHTML = `
    <article class="stat-item"><div class="stat-label">${t("total")}</div><div class="stat-value">${total}</div></article>
    <article class="stat-item"><div class="stat-label">${t("active")}</div><div class="stat-value">${active}</div></article>
    <article class="stat-item"><div class="stat-label">${t("completed")}</div><div class="stat-value">${completed}</div></article>
    <article class="stat-item"><div class="stat-label">${t("urgent")}</div><div class="stat-value">${urgent}</div></article>
    <article class="stat-item"><div class="stat-label">${t("overdue")}</div><div class="stat-value">${overdue}</div></article>
  `;

  const high = tasks.filter((x) => x.priority === "high").length;
  const medium = tasks.filter((x) => x.priority === "medium").length;
  const low = tasks.filter((x) => x.priority === "low").length;

  el.priorityChart.innerHTML =
    barRow(t("high"), high, total, "fill-high") +
    barRow(t("medium"), medium, total, "fill-medium") +
    barRow(t("low"), low, total, "fill-low");

  el.statusChart.innerHTML =
    barRow(t("active"), active, total, "fill-active") +
    barRow(t("completed"), completed, total, "fill-completed");
}

function render() {
  applyStaticTranslations();
  const tasks = sortTasks(readTasks()).map(withComputedFields);
  const active = tasks.filter((x) => !x.completed);
  const completed = tasks.filter((x) => x.completed);

  renderStats(tasks);
  el.activeTasks.innerHTML = active.length ? active.map(taskCard).join("") : `<p>${t("noActive")}</p>`;
  el.completedTasks.innerHTML = completed.length ? completed.map(taskCard).join("") : `<p>${t("noCompleted")}</p>`;
}

function completeTask(taskId) {
  writeTasks(readTasks().map((task) => (task.id === taskId ? { ...task, completed: true } : task)));
  render();
}

function deleteTask(taskId) {
  writeTasks(readTasks().filter((task) => task.id !== taskId));
  render();
}

function validateFormPayload(payload) {
  if (!payload.title || !payload.description || !payload.course || !payload.deadline) return t("fillAllFields");
  if (!["low", "medium", "high"].includes(payload.priority)) return t("invalidPriority");
  return null;
}

el.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    course: document.getElementById("course").value.trim(),
    deadline: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
  };

  const err = validateFormPayload(payload);
  if (err) return showMessage(err, "#b91c1c");

  const tasks = readTasks();
  tasks.push({ ...payload, id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`, completed: false, created_at: new Date().toISOString() });
  writeTasks(tasks);
  el.taskForm.reset();
  showMessage(t("taskAdded"), "#166534");
  render();
});

el.langToggle.addEventListener("click", () => {
  currentLang = currentLang === "fi" ? "en" : "fi";
  localStorage.setItem(LANG_KEY, currentLang);
  render();
});

window.completeTask = completeTask;
window.deleteTask = deleteTask;

ensureSeedData();
render();
