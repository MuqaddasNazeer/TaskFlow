// notifier.js - Advanced multi-stage notification system

const notifiedStages = {}; // Stores taskId => Set of notified stages

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      console.warn('🔕 Notification permission denied.');
    }
  });
}

function stageAlreadyNotified(taskId, stage) {
  if (!notifiedStages[taskId]) return false;
  return notifiedStages[taskId].has(stage);
}

function markStageNotified(taskId, stage) {
  if (!notifiedStages[taskId]) {
    notifiedStages[taskId] = new Set();
  }
  notifiedStages[taskId].add(stage);
}

// Notify with title, body, icon
function showNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    requireInteraction: true  // 🔔 Make notification persistent
  });

  notification.onclick = () => {
    window.focus();
    notification.close(); // Manually close on click
  };
}


// Exported function for checking tasks
export function checkUpcomingTasks(tasks) {
  const now = new Date();

  tasks.forEach(task => {
    if (task.completed || !task.deadline || !task.time) return;

    const taskDateTime = new Date(`${task.deadline}T${task.time}`);
    const diffMinutes = Math.floor((taskDateTime - now) / (1000 * 60));
    const taskId = task.id;

    console.log(`⏱ Task ${task.title}: ${diffMinutes} minutes left`);

    if (diffMinutes <= 60 && diffMinutes > 10 && !stageAlreadyNotified(taskId, '1hr')) {
      console.log(`🔔 Notifying 1hr for ${task.title}`);
      showNotification('⏳ Task in 1 Hour', `'${task.title}' is due at ${task.time}`);
      markStageNotified(taskId, '1hr');
    }

    if (diffMinutes <= 10 && diffMinutes > 0 && !stageAlreadyNotified(taskId, '10min')) {
      console.log(`🔔 Notifying 10min for ${task.title}`);
      showNotification('⏰ Task in 10 Minutes', `'${task.title}' is due soon!`);
      markStageNotified(taskId, '10min');
    }

    if (diffMinutes <= 0 && !stageAlreadyNotified(taskId, 'overdue')) {
      console.log(`🔔 Notifying overdue for ${task.title}`);
      showNotification('⚠️ Task Overdue', `'${task.title}' was due at ${task.time}`);
      markStageNotified(taskId, 'overdue');
    }
  });
}

