import { checkUpcomingTasks } from '../Notifications/notifier.js';

let isEditing = false;
let editingTaskId = null;

const BASE_URL = 'http://localhost:3000/api';

// Retrieve user credentials from localStorage
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('name');

// Redirect unauthorized users
if (!userId) {
  alert('You must log in first.');
  window.location.href = 'login.html';
}

// Display user greeting and avatar
document.getElementById('username').innerText = userName || 'User';
document.getElementById('greeting').innerText = `Welcome, ${userName || 'User'}!`;
document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2188ff&color=fff&rounded=true&size=40`;

// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskFormSection = document.getElementById('taskForm');
const taskFormEl = document.getElementById('taskFormEl');
const taskList = document.getElementById('taskList');

// Toggle task form visibility
addTaskBtn.addEventListener('click', () => {
  taskFormSection.classList.toggle('hidden');
});

// Handle task submission (create or update)
taskFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskData = {
    userId,
    title: document.getElementById('title').value,
    deadline: document.getElementById('deadline').value,
    time: document.getElementById('time').value,
    category: document.getElementById('category').value,
  };

  try {
    if (isEditing) {
      await fetch(`${BASE_URL}/tasks/update/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      isEditing = false;
      editingTaskId = null;
    } else {
      await fetch(`${BASE_URL}/tasks/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
    }

    taskFormEl.reset();
    taskFormSection.classList.add('hidden');
    loadTasks();
  } catch (error) {
    console.error('Error submitting task:', error);
  }
});

// Initialize dark mode based on saved preference
const darkToggle = document.getElementById('darkModeToggle');
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark');
  darkToggle.checked = true;
}
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
});

// Task filtering logic
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'All';

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTasks();
  });
});

// Format deadline to human-readable string
function formatDeadline(dateStr, timeStr) {
  const now = new Date();
  const taskTime = new Date(`${dateStr}T${timeStr}`);
  const diffMs = taskTime - now;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMin / 60);

  if (diffMin < 0) return `Overdue (${dateStr} ${timeStr})`;
  if (diffMin <= 60) return `Due in ${diffMin} min (${dateStr} ${timeStr})`;
  if (diffHrs <= 3) return `In ${diffHrs} hr (${dateStr} ${timeStr})`;
  return `${dateStr} ${timeStr}`;
}

// Determine urgency class for styling
function getTaskUrgencyClass(task) {
  if (task.completed) return 'overdue'; // can be customized to 'safe'

  const now = new Date();
  const taskTime = new Date(`${task.deadline}T${task.time}`);
  const diffMin = Math.floor((taskTime - now) / (1000 * 60));

  if (diffMin < 0) return 'overdue';
  if (diffMin <= 10) return 'danger';
  if (diffMin <= 60) return 'warning';
  return 'safe';
}

// Load and categorize tasks
async function loadTasks() {
  try {
    const res = await fetch(`${BASE_URL}/tasks/user/${userId}`);
    const tasks = await res.json();

    checkUpcomingTasks(tasks);
    const filtered = activeFilter === 'All' ? tasks : tasks.filter(t => t.category === activeFilter);

    if (filtered.length === 0) {
      taskList.innerHTML = '<p>No tasks found.</p>';
      return;
    }

    // Categorization
    const now = new Date();
    const overdue = [];
    const inProgress = [];
    const completed = [];

    filtered.forEach(task => {
      const taskTime = new Date(`${task.deadline}T${task.time}`);
      if (task.completed) completed.push(task);
      else if (taskTime < now) overdue.push(task);
      else inProgress.push(task);
    });

    // Sorting
    const sortByTime = (a, b) => new Date(`${a.deadline}T${a.time}`) - new Date(`${b.deadline}T${b.time}`);
    overdue.sort(sortByTime);
    inProgress.sort(sortByTime);
    completed.sort(sortByTime);

    // Render categorized tasks
    taskList.innerHTML = '';

    if (overdue.length > 0) {
      taskList.innerHTML += `<h3 style="color:#f44336;">Overdue Tasks</h3>`;
      overdue.forEach(renderTaskCard);
    }

    if (inProgress.length > 0) {
      taskList.innerHTML += `<h3 style="color:#ff9800;">In Progress Tasks</h3>`;
      inProgress.forEach(renderTaskCard);
    }

    if (completed.length > 0) {
      taskList.innerHTML += `<h3 style="color:#4caf50;">Completed Tasks</h3>`;
      completed.forEach(renderTaskCard);
    }

  } catch (error) {
    console.error('Error loading tasks:', error);
    taskList.innerHTML = '<p>Something went wrong while loading tasks.</p>';
  }
}

// Task actions
async function markComplete(id) {
  await fetch(`${BASE_URL}/tasks/complete/${id}`, { method: 'PUT' });
  loadTasks();
}

function editTask(id, title, deadline, time, category) {
  isEditing = true;
  editingTaskId = id;

  document.getElementById('title').value = title;
  document.getElementById('deadline').value = deadline;
  document.getElementById('time').value = time;
  document.getElementById('category').value = category;

  taskFormSection.classList.remove('hidden');
}

// Render task card HTML
function renderTaskCard(task) {
  const now = new Date();
  const taskTime = new Date(`${task.deadline}T${task.time}`);
  const diffMin = Math.floor((taskTime - now) / (1000 * 60));

  let urgencyClass = '';
  if (task.completed) urgencyClass = 'completed';
  else if (diffMin < 0) urgencyClass = 'overdue';
  else if (diffMin <= 10) urgencyClass = 'danger';
  else if (diffMin <= 60) urgencyClass = 'warning';
  else urgencyClass = 'safe';

  const el = document.createElement('div');
  el.className = `task-card ${urgencyClass}`;

  el.innerHTML = `
    <div class="info">
      <strong>${task.title}</strong><br>
      <div class="meta">
        <span>${formatDeadline(task.deadline, task.time)}</span>
        <span>${task.category}</span>
      </div>
    </div>
    <div class="actions">
      ${task.completed ? '✔️ Completed' : `<button onclick="markComplete(${task.id})">Mark Done</button>`}
      <button onclick="editTask(${task.id}, '${task.title}', '${task.deadline}', '${task.time}', '${task.category}')">Edit</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `;
  taskList.appendChild(el);
}

// Delete task with confirmation
async function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    await fetch(`${BASE_URL}/tasks/delete/${id}`, { method: 'DELETE' });
    loadTasks();
  }
}

// Export task functions to global scope
window.deleteTask = deleteTask;
window.editTask = editTask;
window.markComplete = markComplete;

// Initial data load
loadTasks();
setInterval(loadTasks, 10000); // Auto-refresh tasks every 10 seconds
