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
import { useSearchParams } from "react-router-dom";

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

	const { studentViewCourseList, setStudentViewCourseList } =
		useContext(StudentContext);

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
			if (indexOfCurrentOption === -1)
				cpyFilters[getSectionId].push(getCurrentOption.id);
			else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
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
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">All Courses</h1>
			<div className="flex flex-col md:flex-row gap-4">
				<aside className="w-full md:w-64 space-y-4">
					<div className="p-4 space-y-4">
						{Object.keys(filterOptions).map((keyItem) => (
							<div className="p-4 space-y-4" key={keyItem}>
								<h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
								<div className="grid gap-2 mt-2">
									{filterOptions[keyItem].map((option) => (
										<Label
											key={option.id}
											className="flex font-medium items-center gap-3"
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
				<main className="flex-1">
					<div className="flex justify-end items-center mb-4 gap-5">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="flex items-center gap-2 p-4"
								>
									<ArrowUpDownIcon className="w-4 h-4" />
									<span className="text-[16px] font-medium">Sort By</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[180px]">
								<DropdownMenuRadioGroup
									value={sort}
									onValueChange={(value) => setSort(value)}
								>
									{sortOptions.map((sortItem) => (
										<DropdownMenuRadioItem
											key={sortItem.id}
											value={sortItem.id}
										>
											{sortItem.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<span className="text-sm text-gary-600 font-medium">
							10 Results
						</span>
					</div>
					<div className="space-y-4">
						{studentViewCourseList && studentViewCourseList.length > 0 ? (
							studentViewCourseList.map((courseItem) => (
								<Card key={courseItem?._id} className="cursor-pointer">
									<CardContent className="flex gap-4 p-4">
										<div className="w-48 h-32 flex-shrink-0">
											<img
												src={courseItem.image}
												alt={courseItem.title}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1">
											<CardTitle className="text-xl mb-2">
												{courseItem?.title}
											</CardTitle>
											<p className="text-sm  text-gray-600 mb-1">
												Created By{" "}
												<span className="font-bold">
													{courseItem.instructorName}
												</span>
											</p>
											<p className="text-[16px] text-gray-600 mt-3 mb-2">
												{`${courseItem?.curriculum?.length} ${
													courseItem?.curriculum?.length > 0
														? "Lectures"
														: "Lecture"
												} - ${courseItem?.level.toUpperCase()} Level`}
											</p>
											<p className="font-bold text-[16px]">
												${courseItem.pricing}
											</p>
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<h2 className="font-extrabold text-4xl">No Course Found</h2>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};
