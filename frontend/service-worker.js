self.addEventListener("push", function (event) {
  const data = event.data.json(); // Payload sent from the backend
  const title = data.title || "Task Reminder";
  const options = {
    body: data.body,
    icon: "./resources/images/notification-icon.png",
    badge: "./resources/images/notification-badge.png",
    data: data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  const notificationData = event.notification.data;
  event.notification.close();

  if (event.action === "complete") {
    // Handle task completion
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          if (clientList.length > 0) {
            clientList[0].postMessage({
              action: "completeTask",
              taskId: notificationData.task.id,
            });
            if (clientList[0].focus) return clientList[0].focus();
          }
        })
    );
  }
});
