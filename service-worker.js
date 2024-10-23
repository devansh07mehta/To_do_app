self.addEventListener("push", function (event) {
  const taskData = event.data.json(); // Assuming you send JSON data for the task

  const options = {
    body: `Task "${taskData.task}" is due!`,
    icon: "notification-icon.png",
    badge: "notification-badge.png",
    vibrate: [100, 50, 100],
    data: {
      taskId: taskData.id,
      dueDate: taskData.dueDate,
    },
    actions: [
      { action: "complete", title: "Mark Complete" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification("Task Reminder", options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "complete") {
    // Handle marking task as complete
    // Maybe send a message to the backend to mark it as done
    // Send message to the client to mark the task complete
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        if (clientList.length > 0) {
          // If a window is open, send a message to mark the task as complete
          clientList[0].postMessage({
            action: "completeTask",
            taskId: taskId,
          });
        }
      })
    );
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus the client window if it's open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }

      // If the window is not open, open a new window
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
