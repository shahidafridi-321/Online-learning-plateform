const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourse = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
	try {
		const { userId, courseId, lectureId } = req.body;
		let progress = await CourseProgress.findOne({
			userId,
			courseId,
		});
		if (!progress) {
			progress = new CourseProgress({
				userId,
				courseId,
				lecturesProgress: [
					{
						lectureId,
						viewed: true,
						dateViewed: new Date(),
					},
				],
			});
			await progress.save();
		} else {
			const lectureProgress = progress.lecturesProgress.find(
				(item) => item.lectureId === lectureId
			);
			if (lectureProgress) {
				lectureProgress.viewed = true;
				lectureProgress.dateViewed = new Date();
			} else {
				progress.lecturesProgress.push({
					lectureId,
					viewed: true,
					dateViewed: new Date(),
				});
			}
			await progress.save();
		}

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course Not Found",
			});
		}

		// Checks Is all the lectures are viewed ro not
		const allLeturesViewed =
			progress.lecturesProgress.length === course.curriculum.length &&
			progress.lecturesProgress.every((item) => item.viewed);

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
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourse.findOne({ userId });
    const isCurrentCoursePurchasedByCurrentUser =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUser) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You Need To Purchase The Course To Access It!",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course Not Found!",
        });
      }
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
    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
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
