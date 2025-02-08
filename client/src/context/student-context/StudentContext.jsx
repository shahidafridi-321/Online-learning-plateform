import React, { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentContextProvider = ({ children }) => {
	const [studentViewCourseList, setStudentViewCourseList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [studentViewCourseDetailsPage, setStudentViewCourseDetailsPage] =
		useState(null);
	const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);

	return (
		<StudentContext.Provider
			value={{
				studentViewCourseList,
				setStudentViewCourseList,
				loading,
				setLoading,
				studentViewCourseDetailsPage,
				setStudentViewCourseDetailsPage,
				currentCourseDetailsId,
				setCurrentCourseDetailsId,
			}}
		>
			{children}
		</StudentContext.Provider>
	);
};
