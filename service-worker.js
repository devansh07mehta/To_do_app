self.addEventListener("notificationclick", function (event) {
  const notificationData = event.notification.data;
  const taskId = notificationData.task.id; // Use task ID from notification data

  event.notification.close();

  if (event.action === "complete") {
    // Handle marking task as complete
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          if (clientList.length > 0) {
            // Send message to the first available client to mark the task as complete
            clientList[0].postMessage({
              action: "completeTask",
              taskId: taskId,
            });
            // Focus the client
            if (clientList[0].focus) {
              return clientList[0].focus();
            }
          }
        })
    );
  } else {
    // Ensure the browser window is focused when the notification is clicked
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === "/" && "focus" in client) {
              return client.focus();
            }
          }

          // Open the app window if it's not already open
          if (clients.openWindow) {
            return clients.openWindow("/");
          }
        })
    );
  }
});
