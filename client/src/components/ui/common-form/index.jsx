import React from "react";
import { Button } from "../button";
import { FormControls } from "./FormControls";

export const CommonForm = ({
	handleSubmit,
	buttonText,
	formControls,
	formData,
	setFormData,
	isButtonDisabled = false,
}) => {
	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<FormControls
				formControls={formControls}
				formData={formData}
				setFormData={setFormData}
			/>
			<Button
				type="submit"
				className={`w-full py-3 text-sm md:text-base font-medium rounded-lg transition-all ${
					isButtonDisabled
						? "bg-gray-300 cursor-not-allowed text-gray-500"
						: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
				}`}
				disabled={isButtonDisabled}
			>
				{buttonText || "Submit"}
			</Button>
		</form>
	);
};
