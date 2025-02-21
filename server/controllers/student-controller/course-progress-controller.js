const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourse = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
	try {
		const { userId, courseId, lectureId } = req.body;
		let progress = await CourseProgress.find({
			userId,
			courseId,
		});
		if (!progress) {
			progress = new CourseProgress({
				userId,
				courseId,
				/* 	completed: true,
				completionDate: new Date(), */
				lectureProgress: [
					{
						lectureId,
						viewed: true,
						dateViewed: new Date(),
					},
				],
			});
			await progress.save();
		} else {
			const lectureProgress = progress.lectureProgress.find(
				(item) => item.lectureId === lectureId
			);
			if (lectureProgress) {
				lectureProgress.viewed = true;
				lectureProgress.dateViewed = new Date();
			} else {
				progress.lectureProgress.push({
					lectureId,
					viewed: true,
					dateViewed: new Date(),
				});
			}
			await progress.save();
		}

		const course = Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course Not Found",
			});
		}

		// Checks Is all the lectures are viewed ro not
		const allLeturesViewed =
			progress.lectureProgress.length === course.curriculum.length &&
			progress.lectureProgress.every((item) => item.viewed);

		if (allLeturesViewed) {
			progress.completed = true;
			progress.completionDate = new Date();
			await progress.save();
		}

		res.status(200).json({
			success: true,
			message: "Lecture Marked as completed",
			data: progress,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Error Occured in Current course Marked as view",
		});
	}
};
// get our  current course progress
const getCurrentCourseProgress = async (req, res) => {
	try {
		// get current userId and courseid
		const { userId, courseId } = req.params;

		//check how many courses the current user have purchased
		const studentPurchasedCourses = await StudentCourse.findOne({
			userId,
		});

		//checks the current course is purchased by the user or not
		const isCurrentCoursePurchasedByCurrentUser =
			studentPurchasedCourses?.courses?.findIndex(
				(item) => item.courseId === courseId
			) > -1;

		// if the current course is not purchased by the user do this
		if (!isCurrentCoursePurchasedByCurrentUser) {
			return res.status(200).json({
				success: true,
				data: {
					isPurchased: false,
				},
				message: "You Need To Purchase The Course To Access It!",
			});
		}

		// gets the current user course progress from database using courseProgress schema
		const currentUserCourseProgress = await CourseProgress.findOne({
			userId,
			courseId,
		});

		// the current user has that course or not if yes then checks if the progress is started yet or not
		if (
			!currentUserCourseProgress ||
			currentUserCourseProgress?.lectureProgress?.length === 0
		) {
			const course = await Course.findById(courseId);

			//if no course is found against the current user id
			if (!course) {
				return res.status(404).json({
					success: false,
					message: "Course Not Found!",
				});
			}

			//the current user not start course yet
			return res.status(200).json({
				success: true,
				message: "No Progress found, you can start watching the course",
				data: {
					courseDetails: course,
					progress: [],
					isPurchased: true,
				},
			});
		}

		const courseDetails = await Course.findById(courseId);
		// returns the current user course progress
		res.status(200).json({
			success: true,
			data: {
				courseDetails,
				progress: currentUserCourseProgress.lectureProgress,
				completed: currentUserCourseProgress.completed,
				completionDate: currentUserCourseProgress.completionDate,
				isPurchased: true,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Error Occured in Current course progress",
		});
	}
};

// reset course progress
const resetCurrentCourseProgress = async (req, res) => {
	try {
		const { userId, courseId } = req.body;
		const progress = await CourseProgress.findOne({ userId, courseId });

		if (!progress) {
			return res.status(404).json({
				success: false,
				message: "No Progress Found",
			});
		}
		progress.lectureProgress = [];
		progress.completed = false;
		completionDate = null;
		await progress.save();

		res.status(200).json({
			success: true,
			message: "Course Progress Reseted!",
			data: progress,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Error Occured in Current course Reset",
		});
	}
};

module.exports = {
	markCurrentLectureAsViewed,
	getCurrentCourseProgress,
	resetCurrentCourseProgress,
};
