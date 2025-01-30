import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseCurriculum } from "@/components/instructor-view/CourseCurriculum";
import { CourseLanding } from "@/components/instructor-view/CourseLanding";
import { CourseSetting } from "@/components/instructor-view/CourseSetting";

export const AddNewCoursePage = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800 p-6">
			{/* Page Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-extrabold">Create a New Course</h1>
				<Button className="text-sm font-bold px-8 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700">
					SUBMIT
				</Button>
			</div>

			<Card className="p-6 bg-white shadow-lg rounded-lg">
				<CardContent>
					<Tabs defaultValue="curriculum" className="space-y-4">
						<TabsList className="flex w-full rounded-lg justify-between space-x-2  bg-transparent pb-3 mb-6">
							<TabsTrigger
								value="curriculum"
								className={`py-2 flex-grow text-sm md:text-base font-medium shadow-lg  text-gray-800 transition-all hover:bg-gray-100 `}
							>
								Curriculum
							</TabsTrigger>
							<TabsTrigger
								value="course-landing-page"
								className={`py-2 flex-grow text-sm md:text-base font-medium shadow-lg  text-gray-800 transition-all hover:bg-gray-100 `}
							>
								Course Landing Page
							</TabsTrigger>
							<TabsTrigger
								value="settings"
								className={`py-2 flex-grow text-sm md:text-base font-medium shadow-lg  text-gray-800 transition-all hover:bg-gray-100 `}
							>
								Settings
							</TabsTrigger>
						</TabsList>

						<TabsContent value="curriculum">
							<CourseCurriculum />
						</TabsContent>
						<TabsContent value="course-landing-page">
							<CourseLanding />
						</TabsContent>
						<TabsContent value="settings">
							<CourseSetting />
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};
