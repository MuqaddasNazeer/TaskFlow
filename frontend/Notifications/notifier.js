// notifier.js — Multi-stage task notification system

// Tracks which stages of notification have already been sent for each task
const notifiedStages = {}; // Format: { taskId: Set(stage1, stage2, ...) }

// Request permission for desktop notifications (once per session)
if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      console.warn('Notification permission denied by the user.');
    }
  });
}

// Check if a particular notification stage has already been triggered for a task
function stageAlreadyNotified(taskId, stage) {
  return notifiedStages[taskId]?.has(stage) || false;
}

// Mark a specific stage as notified to avoid duplicate alerts
function markStageNotified(taskId, stage) {
  if (!notifiedStages[taskId]) {
    notifiedStages[taskId] = new Set();
  }
  notifiedStages[taskId].add(stage);
}

// Utility function to show a desktop notification
function showNotification(title, body) {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    requireInteraction: true, // Keeps the notification visible until the user dismisses it
  });

  notification.onclick = () => {
    if (typeof window !== 'undefined') {
      window.focus();
    }
    notification.close();
  };
}

/**
 * Exported function to check tasks and trigger stage-based reminders.
 * Notifications are sent at:
 * - 1 hour before deadline
 * - 10 minutes before deadline
 * - After deadline (overdue)
 */
export function checkUpcomingTasks(tasks) {
  const now = new Date();

  tasks.forEach(task => {
    if (task.completed || !task.deadline || !task.time) return;

    const taskDateTime = new Date(`${task.deadline}T${task.time}`);
    const diffMinutes = Math.floor((taskDateTime - now) / (1000 * 60));
    const taskId = task.id;

    if (diffMinutes <= 60 && diffMinutes > 10 && !stageAlreadyNotified(taskId, '1hr')) {
      showNotification('Task Due in 1 Hour', `'${task.title}' is scheduled at ${task.time}`);
      markStageNotified(taskId, '1hr');
    }

    if (diffMinutes <= 10 && diffMinutes > 0 && !stageAlreadyNotified(taskId, '10min')) {
      showNotification('Task Due in 10 Minutes', `'${task.title}' is approaching its deadline.`);
      markStageNotified(taskId, '10min');
    }

    if (diffMinutes <= 0 && !stageAlreadyNotified(taskId, 'overdue')) {
      showNotification('Task Overdue', `'${task.title}' has passed its deadline (${task.time})`);
      markStageNotified(taskId, 'overdue');
    }
  });
}
