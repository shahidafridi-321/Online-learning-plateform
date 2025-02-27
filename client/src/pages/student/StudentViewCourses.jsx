import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import {
	ArrowUpDownIcon,
	StarIcon,
	FolderIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	SignalIcon,
} from "lucide-react"; // Assuming these icons exist
import React, { useState, useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context/StudentContext";
import {
	fetchStudentViewCourseListService,
	checkCoursePurchaseInfoService,
} from "@/services";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/context/auth-context";
import { motion } from "framer-motion";

// Helper function to create search params
const createSearchParamsHelper = (filterParams) => {
	const queryParams = [];
	for (const [key, value] of Object.entries(filterParams)) {
		if (Array.isArray(value) && value.length > 0) {
			const paramValue = value.join(",");
			queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
		}
	}
	return queryParams.join("&");
};

export const StudentViewCourses = () => {
	const [sort, setSort] = useState("price-lowtohigh");
	const [filters, setFilters] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();
	const {
		studentViewCourseList,
		setStudentViewCourseList,
		loading,
		setLoading,
	} = useContext(StudentContext);

	// Navigate to course details or progress based on purchase status
	const handleCourseNavigate = async (courseId) => {
		const response = await checkCoursePurchaseInfoService(
			courseId,
			auth?.user?._id
		);
		if (response?.success) {
			if (response?.data) {
				navigate(`/course-progress/${courseId}`);
			} else {
				navigate(`/course/details/${courseId}`);
			}
		}
	};

	// Handle filter changes
	const handleFilterOnChange = (getSectionId, getCurrentOption) => {
		let cpyFilters = { ...filters };
		const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
		if (indexOfCurrentSection === -1) {
			cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption.id] };
		} else {
			const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
				getCurrentOption.id
			);
			if (indexOfCurrentOption === -1) {
				cpyFilters[getSectionId].push(getCurrentOption.id);
			} else {
				cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
			}
		}
		setFilters(cpyFilters);
		sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
	};

	// Fetch courses based on filters and sort
	const fetchAllStudentViewCourses = async (filters, sort) => {
		const query = new URLSearchParams({ ...filters, sortBy: sort });
		const response = await fetchStudentViewCourseListService(query);
		if (response?.success) {
			setStudentViewCourseList(response.data);
			setLoading(false);
		}
	};

	// Effect to fetch courses when filters or sort change
	useEffect(() => {
		if (filters !== null && sort !== null) {
			fetchAllStudentViewCourses(filters, sort);
		}
	}, [filters, sort]);

	// Effect to update search params when filters change
	useEffect(() => {
		const buildQueryStringForFilters = createSearchParamsHelper(filters);
		setSearchParams(new URLSearchParams(buildQueryStringForFilters));
	}, [filters]);

	// Effect to initialize sort and filters
	useEffect(() => {
		setSort("price-lowtohigh");
		setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-950 dark:to-black">
			<div className="max-w-6xl mx-auto p-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-xl dark:from-indigo-900 dark:to-purple-900"
				>
					<h1 className="text-5xl font-extrabold text-white mb-2">
						Explore Our Courses
					</h1>
					<p className="text-lg text-indigo-100 dark:text-purple-200">
						Discover a world of knowledge with our diverse range of courses.
					</p>
				</motion.div>

				<div className="flex flex-col md:flex-row gap-8">
					<motion.aside
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="w-full md:w-64"
					>
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-6">
							{Object.keys(filterOptions).map((keyItem) => (
								<div key={keyItem} className="mb-6">
									<h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
										{keyItem === "category" && (
											<FolderIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
										)}
										{keyItem === "level" && (
											<SignalIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
										)}
										{keyItem.toUpperCase()}
									</h3>
									<div className="space-y-3">
										{filterOptions[keyItem].map((option) => (
											<Label
												key={option.id}
												className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
											>
												<Checkbox
													checked={filters[keyItem]?.includes(option.id)}
													onCheckedChange={() =>
														handleFilterOnChange(keyItem, option)
													}
												/>
												{option.label}
											</Label>
										))}
									</div>
								</div>
							))}
							<Button
								onClick={() => setFilters({})}
								className="w-full bg-red-500 hover:bg-red-600 text-white"
							>
								Reset Filters
							</Button>
						</div>
					</motion.aside>

					<motion.main
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="flex-1"
					>
						<div className="flex flex-col sm:flex-row items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
										>
											<ArrowUpDownIcon className="w-5 h-5" />
											<span className="font-medium">Sort By</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
									>
										<DropdownMenuRadioGroup
											value={sort}
											onValueChange={(value) => setSort(value)}
										>
											{sortOptions.map((sortItem) => (
												<DropdownMenuRadioItem
													key={sortItem.id}
													value={sortItem.id}
													className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center gap-2"
												>
													{sortItem.id === "price-lowtohigh" && (
														<ArrowUpIcon className="ml-2 w-4 h-4" />
													)}
													{sortItem.id === "price-hightolow" && (
														<ArrowDownIcon className="ml-2 w-4 h-4" />
													)}
													{sortItem.label}
												</DropdownMenuRadioItem>
											))}
										</DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
								<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
									{studentViewCourseList.length} Results
								</span>
							</div>
						</div>

						<div className="space-y-6">
							{loading ? (
								<div className="space-y-6">
									{[...Array(3)].map((_, index) => (
										<div
											key={index}
											className="flex gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
										>
											<Skeleton className="w-48 h-32 rounded-lg" />
											<div className="flex-1 space-y-4">
												<Skeleton className="h-8 w-3/4" />
												<Skeleton className="h-4 w-1/2" />
												<Skeleton className="h-4 w-1/3" />
												<Skeleton className="h-6 w-1/4" />
											</div>
										</div>
									))}
								</div>
							) : studentViewCourseList.length > 0 ? (
								studentViewCourseList.map((courseItem, index) => (
									<motion.div
										key={courseItem?._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
										whileHover={{ scale: 1.02 }}
										className="cursor-pointer"
										onClick={() => handleCourseNavigate(courseItem?._id)}
									>
										<Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
											<div className="flex flex-col sm:flex-row">
												<div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
													<img
														src={courseItem.image}
														alt={courseItem.title}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="p-6 flex-1">
													<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
														{courseItem.title}
													</CardTitle>
													<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
														by{" "}
														<span className="font-semibold">
															{courseItem.instructorName}
														</span>
													</p>
													<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
														<span>
															{courseItem.curriculum?.length} lectures
														</span>
														<span>{courseItem.level}</span>
													</div>
													<div className="flex items-center gap-2 mb-4">
														<StarIcon className="w-5 h-5 text-yellow-500" />
														<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
															{courseItem.rating || "4.5"} (100 reviews)
														</span>
													</div>
													<div className="flex justify-between items-center">
														<p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
															${courseItem.pricing}
														</p>
														<Button
															variant="outline"
															size="sm"
															className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
														>
															View Details
														</Button>
													</div>
												</div>
											</div>
										</Card>
									</motion.div>
								))
							) : (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
									className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
								>
									<img
										src="/path-to-illustration.svg"
										alt="No courses found"
										className="w-64 h-64"
									/>
									<h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
										No Courses Found
									</h2>
									<p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
										It seems there are no courses matching your filters. Try
										adjusting your search or explore our popular categories.
									</p>
									<Button
										onClick={() => navigate("/categories")}
										className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
									>
										Explore Categories
									</Button>
								</motion.div>
							)}
						</div>
					</motion.main>
				</div>
			</div>
		</div>
	);
};
