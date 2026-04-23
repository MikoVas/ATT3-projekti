const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks");
const formMessage = document.getElementById("form-message");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function fetchTasks() {
  const response = await fetch("/tasks");
  const tasks = await response.json();
  renderTasks(tasks);
}

function taskBadges(task) {
  const badges = [];
  if (task.is_urgent) {
    badges.push('<span class="badge urgent">Urgent</span>');
  }
  if (task.completed) {
    badges.push('<span class="badge completed">Completed</span>');
  }
  return badges.join("");
}

function taskMeta(task) {
  const daysText =
    task.days_left < 0
      ? `${Math.abs(task.days_left)} day(s) overdue`
      : `${task.days_left} day(s) left`;

  return `
    <p><strong>Course:</strong> ${escapeHtml(task.course)}</p>
    <p><strong>Deadline:</strong> ${escapeHtml(task.deadline)} (${daysText})</p>
    <p><strong>Priority:</strong> ${escapeHtml(task.priority)}</p>
    <p>${escapeHtml(task.description)}</p>
  `;
}

function renderTasks(tasks) {
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

async function completeTask(taskId) {
  await fetch(`/tasks/${taskId}/complete`, { method: "PUT" });
  await fetchTasks();
}

async function deleteTask(taskId) {
  await fetch(`/tasks/${taskId}`, { method: "DELETE" });
  await fetchTasks();
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  const payload = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    course: document.getElementById("course").value,
    deadline: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
  };

  const response = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    formMessage.textContent = errorData.error || "Failed to create task.";
    formMessage.style.color = "#b91c1c";
    return;
  }

  taskForm.reset();
  formMessage.textContent = "Task added successfully.";
  formMessage.style.color = "#166534";
  await fetchTasks();
});

fetchTasks();
