const express = require("express");
const {
	getAllCourseNotifications,
  markNotificationAsRead,
  deleteNotification
} = require("../../controllers/instructor-controller/course-notification-controller");

const router = express.Router();
router.get("/get/all/notifications/:instructorId", getAllCourseNotifications);
router.put("/notifications/:notificationId/read", markNotificationAsRead);
router.delete("/notifications/:notificationId", deleteNotification);

module.exports = router;
