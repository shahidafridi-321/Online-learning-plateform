import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";

export const InstructorCourses = () => {
	return (
		<Card>
			<CardHeader className="flex justify-between flex-row items-center">
				<CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
				<Button className="p-5">Create New Course</Button>
			</CardHeader>
      <CardContent>
        <div  className="overflow-x-auto">
          

        </div>
      </CardContent>
		</Card>
	);
};
