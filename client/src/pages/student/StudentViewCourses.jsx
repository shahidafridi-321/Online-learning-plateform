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
import { ArrowUpDownIcon } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentViewCourseListService } from "@/services";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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

	const navigate = useNavigate();

	const {
		studentViewCourseList,
		setStudentViewCourseList,
		loading,
		setLoading,
	} = useContext(StudentContext);

	const handleFilterOnChange = (getSectionId, getCurrentOption) => {
		let cpyFilters = { ...filters };
		const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
		if (indexOfCurrentSection === -1) {
			cpyFilters = {
				...cpyFilters,
				[getSectionId]: [getCurrentOption.id],
			};
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

	const fetchAllStudentViewCourses = async (filters, sort) => {
		const query = new URLSearchParams({
			...filters,
			sortBy: sort,
		});
		const response = await fetchStudentViewCourseListService(query);
		if (response?.success) {
			setStudentViewCourseList(response.data);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (filters !== null && sort !== null) {
			fetchAllStudentViewCourses(filters, sort);
		}
	}, [filters, sort]);

	useEffect(() => {
		const buildQueryStringForFilters = createSearchParamsHelper(filters);
		setSearchParams(new URLSearchParams(buildQueryStringForFilters));
	}, [filters]);

	useEffect(() => {
		setSort("price-lowtohigh");
		setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
			<div className="max-w-6xl mx-auto p-8">
				{/* Header */}
				<div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-6 shadow-md">
					<h1 className="text-4xl font-bold text-white">All Courses</h1>
				</div>
				<div className="flex flex-col md:flex-row gap-8">
					{/* Sidebar Filters */}
					<aside className="w-full md:w-64">
						<div className="bg-white rounded-lg shadow p-4 space-y-6">
							{Object.keys(filterOptions).map((keyItem) => (
								<div key={keyItem} className="border-b pb-4">
									<h3 className="text-lg font-bold mb-3 text-gray-800">
										{keyItem.toUpperCase()}
									</h3>
									<div className="grid gap-2">
										{filterOptions[keyItem].map((option) => (
											<Label
												key={option.id}
												className="flex items-center gap-3 text-gray-700"
											>
												<Checkbox
													checked={
														filters &&
														Object.keys(filters).length > 0 &&
														filters[keyItem] &&
														filters[keyItem].indexOf(option.id) > -1
													}
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
						</div>
					</aside>
					{/* Main Listing */}
					<main className="flex-1">
						<div className="flex flex-col sm:flex-row items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-2 px-4 py-2"
										>
											<ArrowUpDownIcon className="w-5 h-5" />
											<span className="font-medium text-gray-700">Sort By</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48">
										<DropdownMenuRadioGroup
											value={sort}
											onValueChange={(value) => setSort(value)}
										>
											{sortOptions.map((sortItem) => (
												<DropdownMenuRadioItem
													key={sortItem.id}
													value={sortItem.id}
													className="px-3 py-1 text-gray-700 hover:bg-gray-100"
												>
													{sortItem.label}
												</DropdownMenuRadioItem>
											))}
										</DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
								<span className="text-sm text-gray-600 font-medium">
									{studentViewCourseList.length} Results
								</span>
							</div>
						</div>
						<div className="space-y-6">
							{studentViewCourseList && studentViewCourseList.length > 0 ? (
								studentViewCourseList.map((courseItem) => (
									<Card
										key={courseItem?._id}
										onClick={() =>
											navigate(`/course/details/${courseItem?._id}`)
										}
										className="cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
									>
										<CardContent className="flex gap-6 p-6">
											<div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
												<img
													src={courseItem.image}
													alt={courseItem.title}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="flex-1">
												<CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
													{courseItem.title}
												</CardTitle>
												<p className="text-sm text-gray-600 mb-1">
													Created By{" "}
													<span className="font-bold text-gray-800">
														{courseItem.instructorName}
													</span>
												</p>
												<p className="text-base text-gray-600 my-2">
													{`${courseItem.curriculum?.length} ${
														courseItem.curriculum?.length > 1
															? "Lectures"
															: "Lecture"
													} - ${courseItem.level.toUpperCase()} Level`}
												</p>
												<p className="text-xl font-bold text-indigo-600">
													${courseItem.pricing}
												</p>
											</div>
										</CardContent>
									</Card>
								))
							) : loading ? (
								<Skeleton />
							) : (
								<h2 className="text-4xl font-extrabold text-center text-gray-700">
									No Course Found
								</h2>
							)}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};
