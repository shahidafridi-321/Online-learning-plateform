const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourse = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
	try {
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
				success: false,
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
