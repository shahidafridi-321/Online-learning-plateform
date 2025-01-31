import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const CourseSetting = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Setting Page</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-3">
					<Label>Upload Course Image</Label>
					<Input type="file" className="mb-4" accept="image/*" />
				</div>
			</CardContent>
		</Card>
	);
};
