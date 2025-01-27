require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

// Handle preflight requests (OPTIONS)
app.options("*", cors());

//database connection
mongoose
	.connect(MONGO_URI)
	.then(() => console.log("mongodb is connected"))
	.catch((e) => console.log(e));

// routes configuration
app.use("/auth", authRoutes);

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
