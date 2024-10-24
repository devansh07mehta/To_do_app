const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

// Your existing routes...

// VAPID keys should be generated only once.
const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  "mailto:devansh1622mht@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

let subscriptions = []; // Store user subscriptions

// Route to handle subscriptions from the frontend
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Route to send notifications
app.post("/send-notification", (req, res) => {
  const notificationPayload = {
    title: "Task Reminder",
    body: "A task is due! Complete it now.",
    task: req.body.task,
  };

  const promises = subscriptions.map((subscription) => {
    return webPush
      .sendNotification(subscription, JSON.stringify(notificationPayload))
      .catch((error) => console.error("Error sending notification", error));
  });

  Promise.all(promises).then(() =>
    res.status(200).json({ message: "Notifications sent" })
  );
});

// Route to send the public VAPID key to the frontend
app.get("/api/public-key", (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log("VAPID Public Key:", vapidKeys.publicKey); // Send this to the frontend
});
