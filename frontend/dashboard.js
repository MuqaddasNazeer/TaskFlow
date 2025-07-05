import { checkUpcomingTasks } from './Notifications/notifier.js';
let isEditing = false;
let editingTaskId = null;

const BASE_URL = 'http://localhost:3000/api';

const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('name');

// 🚫 Protect access if not logged in
if (!userId) {
  alert('You must log in first!');
  window.location.href = 'login.html';
}

// 🧑 Display user name & avatar
document.getElementById('username').innerText = userName || 'User';
document.getElementById('greeting').innerText = `Welcome, ${userName || 'User'}!`;

const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2188ff&color=fff&rounded=true&size=40`;
document.getElementById('userAvatar').src = avatarUrl;

// 🔘 Task creation form toggle
const addTaskBtn = document.getElementById('addTaskBtn');
const taskFormSection = document.getElementById('taskForm');
const taskFormEl = document.getElementById('taskFormEl');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click', () => {
  taskFormSection.classList.toggle('hidden');
});

// 📤 Submit task
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
      // Edit Mode
      await fetch(`${BASE_URL}/tasks/update/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      isEditing = false;
      editingTaskId = null;
    } else {
      // Create Mode
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


// 🌗 Dark Mode toggle
const darkToggle = document.getElementById('darkModeToggle');
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark');
  darkToggle.checked = true;
}

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
});

// 🎯 Filter tasks
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

// 🚀 Load tasks with filter + animation
// ... Other existing global variables ...

// ✅ Deadline formatter function
function formatDeadline(dateStr, timeStr) {
  const now = new Date();
  const taskTime = new Date(`${dateStr}T${timeStr}`);

  const diffMs = taskTime - now;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMin / 60);

  if (diffMin < 0) return `⚠️ Overdue (${dateStr} ${timeStr})`;
  if (diffMin <= 60) return `⏰ Due in ${diffMin} min (${dateStr} ${timeStr})`;
  if (diffHrs <= 3) return `🕒 In ${diffHrs} hr (${dateStr} ${timeStr})`;
  return `📅 ${dateStr} ${timeStr}`;
}

// 🚀 Load tasks with filter + animation
async function loadTasks() {
  const res = await fetch(`${BASE_URL}/tasks/user/${userId}`);
  const tasks = await res.json();
  checkUpcomingTasks(tasks);
 
  const filtered = activeFilter === 'All' ? tasks : tasks.filter(t => t.category === activeFilter);
  if (filtered.length === 0) {
    taskList.innerHTML = '<p>No tasks found.</p>';
    return;
  }

  taskList.innerHTML = '';
  filtered.forEach(task => {
    const el = document.createElement('div');
    el.className = 'task-card';
    el.innerHTML = `
      <div class="info">
        <strong>${task.title}</strong><br>
        <div class="meta">
          <span>${formatDeadline(task.deadline, task.time)}</span>
          <span>📁 ${task.category}</span>
        </div>
      </div>
      <div class="actions">
        ${task.completed ? '✅' : `<button onclick="markComplete(${task.id})">✔️ Done</button>`}
        <button onclick="editTask(${task.id}, '${task.title}', '${task.deadline}', '${task.time}', '${task.category}')">✏️ Edit</button>
        <button onclick="deleteTask(${task.id})">🗑️ Delete</button>
      </div>
    `;
    taskList.appendChild(el);
  });
}

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



async function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    console.log('Deleting Task ID:', id);
    await fetch(`${BASE_URL}/tasks/delete/${id}`, { method: 'DELETE' });
    loadTasks();
  }
}


window.deleteTask = deleteTask;
window.editTask = editTask;
window.markComplete = markComplete;

// 🔃 Initial task load
loadTasks();
setInterval(loadTasks, 10000); // Auto-refresh tasks every 60 seconds
 // check every 30 seconds