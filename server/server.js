require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentReviewRoutes = require("./routes/student-routes/review-routes");

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(morgan("tiny"));
app.use(
	cors({
		origin: "*", // Allow requests from any origin
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
		allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
	})
);

//database connection
mongoose
	.connect(MONGO_URI)
	.then(() => console.log(`${MONGO_URI} is conneted`))
	.catch((e) => console.log(e));

// routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student", studentReviewRoutes);

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).json({
		success: false,
		message: "Something went wrong",
	});
});

app.listen(PORT, () => {
	console.log(`Server is now running on port ${PORT}`);
});
