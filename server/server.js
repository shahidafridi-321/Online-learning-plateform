require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

// Routes imports
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const instructorNotificationsRoutes = require("./routes/instructor-routes/instructor-notifications-routes.js");
const studentCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentReviewRoutes = require("./routes/student-routes/review-routes");
const studentSubscription = require("./routes/student-routes/subscription-routes");
const adminRoutes = require("./routes/admin-routes/admin-routes");
const adminCourseRoutes = require("./routes/admin-routes/admin-course-routes");

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;

// Middleware configuration
app.use(express.json());
app.use(morgan("dev"));
app.use(
	cors({
		origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

// Database connection with modern options
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	});

// Route configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor", instructorNotificationsRoutes);
app.use("/student/course", studentCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/reviews", studentReviewRoutes);
app.use("/student/subscriptions", studentSubscription);
app.use("/admin", adminRoutes);
app.use("/admin", adminCourseRoutes);

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path} - ${req.ip}`);
	next();
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(`[${new Date().toISOString()}] Error:`, err.stack);
	res.status(err.statusCode || 500).json({
		success: false,
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
});

app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV || "development"} mode`
	);
	console.log(`Listening on port ${PORT}`);
});
