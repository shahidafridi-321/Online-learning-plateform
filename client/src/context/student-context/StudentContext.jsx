import React, { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentContextProvider = ({ children }) => {
	const [studentViewCourseList, setStudentViewCourseList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [studentViewCourseDetails, setStudentViewCourseDetails] =
		useState(null);
	const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
	const [setstudentBoughtCoursesList, setStudentBoughtCoursesList] = useState(
		[]
	);

	return (
		<StudentContext.Provider
			value={{
				studentViewCourseList,
				setStudentViewCourseList,
				loading,
				setLoading,
				studentViewCourseDetails,
				setStudentViewCourseDetails,
				currentCourseDetailsId,
				setCurrentCourseDetailsId,
				setstudentBoughtCoursesList,
				setStudentBoughtCoursesList,
			}}
		>
			{children}
		</StudentContext.Provider>
	);
};
